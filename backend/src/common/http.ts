import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

// Restrict this to your deployed frontend origin(s) in production via env var.
const ALLOWED_ORIGIN = process.env.CORS_ALLOWED_ORIGIN || "*";

const BASE_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function ok(body: unknown, statusCode = 200): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode,
    headers: BASE_HEADERS,
    body: JSON.stringify(body),
  };
}

export function noContent(): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode: 204,
    headers: BASE_HEADERS,
    body: "",
  };
}

export function fail(statusCode: number, message: string): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode,
    headers: BASE_HEADERS,
    body: JSON.stringify({ error: message }),
  };
}

export function handleError(err: unknown): APIGatewayProxyStructuredResultV2 {
  if (err instanceof ApiError) {
    return fail(err.statusCode, err.message);
  }
  console.error("Unhandled Lambda error:", err);
  return fail(500, "Internal server error. Please try again.");
}

export function parseBody<T>(event: APIGatewayProxyEventV2): T {
  if (!event.body) {
    throw new ApiError(400, "Request body is required.");
  }
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf-8")
      : event.body;
    return JSON.parse(raw) as T;
  } catch {
    throw new ApiError(400, "Request body must be valid JSON.");
  }
}
