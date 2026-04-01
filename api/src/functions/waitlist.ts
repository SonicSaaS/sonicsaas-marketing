import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { TableClient, TableServiceClient } from "@azure/data-tables";

const TABLE_NAME = "WaitlistSignups";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let tableClient: TableClient | undefined;
let tableReady = false;

async function getTableClient(): Promise<TableClient> {
  if (!tableClient) {
    const connectionString =
      process.env.AZURE_STORAGE_CONNECTION_STRING ||
      process.env.AzureWebJobsStorage;
    if (!connectionString) {
      throw new Error("Missing storage connection string");
    }
    tableClient = TableClient.fromConnectionString(
      connectionString,
      TABLE_NAME
    );
  }
  if (!tableReady) {
    try {
      await tableClient.createTable();
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
  return tableClient;
}

async function handler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  interface WaitlistBody {
    email?: string;
    source?: string;
    company?: string;
    firewallCount?: string;
    referrer?: string;
    utm?: string;
    timezone?: string;
    locale?: string;
    screen?: string;
    userAgent?: string;
    triedDemo?: boolean;
    demoPages?: string[];
  }

  let body: WaitlistBody;
  try {
    body = (await request.json()) as WaitlistBody;
  } catch {
    return {
      status: 400,
      jsonBody: { success: false, error: "Invalid JSON body" },
    };
  }

  const email = body.email?.trim().toLowerCase();
  const source = body.source?.trim() || "unknown";

  if (!email || !EMAIL_REGEX.test(email)) {
    return {
      status: 400,
      jsonBody: {
        success: false,
        error: "A valid email address is required.",
      },
    };
  }

  try {
    const client = await getTableClient();
    const domain = email.split("@")[1];
    const rowKey = email.replace(/[\\/#?%]/g, "_");
    const now = new Date().toISOString();

    // Check if this email already exists to preserve firstSignedUpAt
    let isRepeat = false;
    try {
      await client.getEntity(domain, rowKey);
      isRepeat = true;
    } catch {
      // Entity doesn't exist yet — first signup
    }

    const entity: Record<string, unknown> & { partitionKey: string; rowKey: string } = {
      partitionKey: domain,
      rowKey: rowKey,
      email: email,
      source: source,
      referrer: body.referrer || "",
      utm: body.utm || "",
      timezone: body.timezone || "",
      locale: body.locale || "",
      screen: body.screen || "",
      userAgent: body.userAgent || "",
      triedDemo: body.triedDemo ?? false,
      demoPages: body.demoPages?.join(",") || "",
      signedUpAt: now,
    };

    // Only set firstSignedUpAt on first signup (Merge won't overwrite it later)
    if (!isRepeat) {
      entity.firstSignedUpAt = now;
    }

    if (body.company) entity.company = body.company.trim();
    if (body.firewallCount) entity.firewallCount = body.firewallCount;

    await client.upsertEntity(entity, "Merge");

    context.log(`Waitlist signup: ${email} (source: ${source}, repeat: ${isRepeat})`);

    return {
      status: 200,
      jsonBody: { success: true },
    };
  } catch (err) {
    context.error("Waitlist signup failed:", err);
    return {
      status: 500,
      jsonBody: {
        success: false,
        error: "Server error. Please try again later.",
      },
    };
  }
}

app.http("waitlist", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "waitlist",
  handler,
});
