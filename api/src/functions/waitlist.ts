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

function getTableClient(): TableClient {
  if (!tableClient) {
    const connectionString =
      process.env.AZURE_STORAGE_CONNECTION_STRING ||
      process.env.AzureWebJobsStorage;
    if (!connectionString) {
      throw new Error("Missing storage connection string");
    }
    const serviceClient =
      TableServiceClient.fromConnectionString(connectionString);
    serviceClient.createTable(TABLE_NAME).catch(() => {
      // Table already exists — ignore 409 Conflict
    });
    tableClient = TableClient.fromConnectionString(
      connectionString,
      TABLE_NAME
    );
  }
  return tableClient;
}

async function handler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  let body: { email?: string; source?: string };
  try {
    body = (await request.json()) as { email?: string; source?: string };
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
    const client = getTableClient();
    const domain = email.split("@")[1];
    const rowKey = email.replace(/[\\/#?%]/g, "_");

    await client.upsertEntity(
      {
        partitionKey: domain,
        rowKey: rowKey,
        email: email,
        source: source,
        signedUpAt: new Date().toISOString(),
      },
      "Merge"
    );

    context.log(`Waitlist signup: ${email} (source: ${source})`);

    return {
      status: 200,
      jsonBody: { success: true },
    };
  } catch (err) {
    context.error("Waitlist signup failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return {
      status: 500,
      jsonBody: {
        success: false,
        error: "Server error. Please try again later.",
        debug: message,
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
