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

function getGroups(claims: JwtClaims): string[] {
  const groups = claims["cognito:groups"];
  if (!groups) return [];
  return Array.isArray(groups) ? groups : [groups];
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
