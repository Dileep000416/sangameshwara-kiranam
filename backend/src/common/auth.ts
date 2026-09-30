import type { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { ApiError } from "./http";
import type { JwtClaims } from "./types";

/**
 * Extracts verified Cognito JWT claims from an API Gateway HTTP API event.
 * Requires the route to be protected by the Cognito JWT authorizer configured
 * in infrastructure/lib/api-stack.ts. API Gateway verifies the token signature
 * and expiry BEFORE the Lambda executes, so claims here can be trusted.
 */
export function getClaims(event: APIGatewayProxyEventV2WithJWTAuthorizer): JwtClaims {
  const claims = event.requestContext?.authorizer?.jwt?.claims as JwtClaims | undefined;
  if (!claims || !claims.sub) {
    throw new ApiError(401, "Authentication required.");
  }
  return claims;
}

export function getUserId(event: APIGatewayProxyEventV2WithJWTAuthorizer): string {
  return getClaims(event).sub;
}

/**
 * Normalizes the Cognito groups claim into a clean string array.
 *
 * The shape of `cognito:groups` differs by token source:
 *  - A real decoded JWT gives a JSON array: ["ADMINS"].
 *  - API Gateway's HTTP API JWT authorizer flattens it into a single
 *    bracketed string: "[ADMINS]" or "[ADMINS CUSTOMERS]" (space-separated,
 *    no quotes, no commas).
 * This handles all of those so group checks work regardless of source.
 */
function getGroups(claims: JwtClaims): string[] {
  const groups = claims["cognito:groups"];
  if (!groups) return [];

  if (Array.isArray(groups)) {
    return groups;
  }

  if (typeof groups === "string") {
    // Strip surrounding brackets if present, then split on whitespace/commas.
    const inner = groups.replace(/^\[/, "").replace(/\]$/, "").trim();
    if (!inner) return [];
    return inner.split(/[\s,]+/).filter(Boolean);
  }

  return [];
}

export function isAdmin(claims: JwtClaims): boolean {
  return getGroups(claims).includes("ADMINS");
}

/**
 * Enforces admin-only access. Every admin Lambda handler must call this before
 * performing any mutation. Never trust a role claim sent from the client body —
 * only the verified Cognito group membership on the JWT.
 */
export function requireAdmin(event: APIGatewayProxyEventV2WithJWTAuthorizer): JwtClaims {
  const claims = getClaims(event);
  if (!isAdmin(claims)) {
    throw new ApiError(403, "Admin access required.");
  }
  return claims;
}
