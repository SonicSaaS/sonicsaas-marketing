import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { TableClient } from "@azure/data-tables";
import { createHmac } from "crypto";
import { checkRateLimit, getClientIp } from "../lib/rate-limit";

const TABLE_NAME = "WaitlistSignups";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Demo token lifetime. Long enough that prospects can come back to the demo
// without re-running the waitlist gauntlet, short enough that abandoned tokens
// rotate out. Read-only auditor identity — no mutation risk from a stale token.
const TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

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

// ---------------------------------------------------------------------------
// Turnstile verification
// ---------------------------------------------------------------------------

async function verifyTurnstile(
  token: string,
  context: InvocationContext
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    context.warn("TURNSTILE_SECRET_KEY not set — skipping CAPTCHA verification");
    return true;
  }
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch (err) {
    context.error("Turnstile verification failed:", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Demo token generation (HMAC-SHA256)
// ---------------------------------------------------------------------------

function generateDemoToken(email: string): string | null {
  const secret = process.env.DEMO_TOKEN_SECRET;
  if (!secret) return null;

  const expiry = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const payload = `${Buffer.from(email).toString("base64url")}.${expiry}`;
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

async function handler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  // Rate limit: 5 requests per 15 minutes per IP
  const ip = getClientIp(request);
  const rateCheck = await checkRateLimit('waitlist', ip, 5, 15 * 60 * 1000);
  if (!rateCheck.allowed) {
    return {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil(rateCheck.retryAfterMs / 1000)) },
      jsonBody: { success: false, error: 'Too many requests. Please try again later.' },
    };
  }

  interface WaitlistBody {
    email?: string;
    source?: string;
    company?: string;
    firewallCount?: string;
    role?: string;
    clientCount?: string;
    currentApproach?: string;
    biggestPainPoint?: string;
    heardAbout?: string;
    trickAttempts?: number;
    turnstileToken?: string;
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

  // Verify Turnstile CAPTCHA
  if (body.turnstileToken) {
    const valid = await verifyTurnstile(body.turnstileToken, context);
    if (!valid) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          error: "CAPTCHA verification failed. Please try again.",
        },
      };
    }
  }

  try {
    const client = await getTableClient();
    const domain = email.split("@")[1];
    const rowKey = email.replace(/[\\/#?%]/g, "_");
    const now = new Date().toISOString();

    // Check if this email already exists to preserve firstSignedUpAt
    let existingEntity: Record<string, unknown> | null = null;
    try {
      existingEntity = await client.getEntity(domain, rowKey) as Record<string, unknown>;
    } catch {
      // Entity doesn't exist yet — first signup
    }

    const entity: Record<string, unknown> & {
      partitionKey: string;
      rowKey: string;
    } = {
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

    // Set firstSignedUpAt on first signup, or backfill if missing on existing entry
    if (!existingEntity || !existingEntity.firstSignedUpAt) {
      entity.firstSignedUpAt = (existingEntity?.signedUpAt as string) ?? now;
    }

    // Existing optional fields
    if (body.company) entity.company = body.company.trim();
    if (body.firewallCount) entity.firewallCount = body.firewallCount;

    // New qualification fields
    if (body.role) entity.role = body.role;
    if (body.clientCount) entity.clientCount = body.clientCount;
    if (body.currentApproach) entity.currentApproach = body.currentApproach;
    if (body.biggestPainPoint) entity.biggestPainPoint = body.biggestPainPoint;
    if (body.heardAbout) entity.heardAbout = body.heardAbout;
    if (body.trickAttempts !== undefined)
      entity.trickAttempts = body.trickAttempts;

    await client.upsertEntity(entity, "Merge");

    context.log(
      `Waitlist signup: ${email} (source: ${source}, repeat: ${!!existingEntity})`
    );

    // Generate demo access token
    const demoToken = generateDemoToken(email);

    return {
      status: 200,
      jsonBody: { success: true, ...(demoToken ? { demoToken } : {}) },
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
