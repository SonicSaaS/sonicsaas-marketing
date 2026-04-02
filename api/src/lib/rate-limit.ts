import { TableClient } from "@azure/data-tables";
import { HttpRequest } from "@azure/functions";

const TABLE_NAME = "RateLimitEntries";

let rateLimitClient: TableClient | undefined;
let tableReady = false;

async function getTableClient(): Promise<TableClient> {
  if (!rateLimitClient) {
    const connectionString =
      process.env.AZURE_STORAGE_CONNECTION_STRING ||
      process.env.AzureWebJobsStorage;
    if (!connectionString) {
      throw new Error("Missing storage connection string");
    }
    rateLimitClient = TableClient.fromConnectionString(
      connectionString,
      TABLE_NAME
    );
  }
  if (!tableReady) {
    try {
      await rateLimitClient.createTable();
    } catch (e: unknown) {
      const status = (e as { statusCode?: number }).statusCode;
      if (status !== 409) {
        throw new Error(
          `createTable failed (status ${status}): ${e instanceof Error ? e.message : String(e)}`
        );
      }
    }
    tableReady = true;
  }
  return rateLimitClient;
}

function sanitizeRowKey(value: string): string {
  return value.replace(/[\\/#?%]/g, "_");
}

export async function checkRateLimit(
  functionName: string,
  ip: string,
  maxRequests: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfterMs: number }> {
  const client = await getTableClient();
  const windowStart = new Date(Date.now() - windowMs).toISOString();

  // Query entries within the current window for this function + IP
  const filter = `PartitionKey eq '${functionName}' and ip eq '${ip}' and timestamp ge '${windowStart}'`;
  const entries: { timestamp: string }[] = [];
  for await (const entity of client.listEntities<{ ip: string; timestamp: string }>({
    queryOptions: { filter },
  })) {
    entries.push({ timestamp: entity.timestamp });
  }

  if (entries.length >= maxRequests) {
    // Find the oldest entry to calculate when the window opens up
    const oldest = entries
      .map((e) => new Date(e.timestamp).getTime())
      .sort((a, b) => a - b)[0];
    const retryAfterMs = oldest + windowMs - Date.now();
    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 1000) };
  }

  // Insert new entry
  const now = new Date();
  const rowKey = sanitizeRowKey(`${ip}_${now.getTime()}_${crypto.randomUUID()}`);
  await client.createEntity({
    partitionKey: functionName,
    rowKey,
    ip,
    timestamp: now.toISOString(),
  });

  // Best-effort cleanup of expired entries
  try {
    const expiredFilter = `PartitionKey eq '${functionName}' and ip eq '${ip}' and timestamp lt '${windowStart}'`;
    for await (const entity of client.listEntities<{ ip: string; timestamp: string }>({
      queryOptions: { filter: expiredFilter },
    })) {
      try {
        await client.deleteEntity(entity.partitionKey!, entity.rowKey!);
      } catch {
        // Best-effort — ignore individual delete failures
      }
    }
  } catch {
    // Best-effort — don't fail the request if cleanup fails
  }

  return { allowed: true, retryAfterMs: 0 };
}

export function getClientIp(request: HttpRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can be "client, proxy1, proxy2" — take the first entry
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  const clientIp = request.headers.get("x-client-ip");
  if (clientIp) return clientIp.trim();
  return "unknown";
}
