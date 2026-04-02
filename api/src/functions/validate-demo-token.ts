import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { createHmac } from "crypto";

async function handler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const token = request.query.get("token");
  if (!token) {
    return {
      status: 400,
      jsonBody: { valid: false, error: "Missing token parameter" },
    };
  }

  const secret = process.env.DEMO_TOKEN_SECRET;
  if (!secret) {
    context.error("DEMO_TOKEN_SECRET not configured");
    return {
      status: 500,
      jsonBody: { valid: false, error: "Server configuration error" },
    };
  }

  // Token format: base64url(email).expiryTimestamp.signature
  const parts = token.split(".");
  if (parts.length !== 3) {
    return { status: 400, jsonBody: { valid: false, error: "Malformed token" } };
  }

  const [emailB64, expiryStr, providedSig] = parts;
  const payload = `${emailB64}.${expiryStr}`;
  const expectedSig = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  if (providedSig !== expectedSig) {
    return { status: 403, jsonBody: { valid: false, error: "Invalid token" } };
  }

  const expiry = parseInt(expiryStr, 10);
  const now = Math.floor(Date.now() / 1000);
  if (isNaN(expiry) || now > expiry) {
    return { status: 403, jsonBody: { valid: false, error: "Token expired" } };
  }

  let email: string;
  try {
    email = Buffer.from(emailB64, "base64url").toString("utf-8");
  } catch {
    return { status: 400, jsonBody: { valid: false, error: "Malformed token" } };
  }

  return {
    status: 200,
    jsonBody: { valid: true, email },
  };
}

app.http("validate-demo-token", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "validate-demo-token",
  handler,
});
