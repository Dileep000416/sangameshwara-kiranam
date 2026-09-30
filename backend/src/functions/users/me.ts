import type {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TableNames } from "@common/dynamo";
import { getClaims, getUserId } from "@common/auth";
import { fail, handleError, ok, parseBody } from "@common/http";
import { optionalString, requireString } from "@common/validation";
import type { UserRecord } from "@common/types";

/**
 * GET /me
 * Returns the authenticated customer's profile, creating a default one on
 * first access (a safety net in case the Cognito PostConfirmation trigger
 * has not yet run, e.g. for pre-existing/imported users).
 */
export async function getMe(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    const claims = getClaims(event);
    const userId = claims.sub;

    const existing = await ddb.send(
      new GetCommand({ TableName: TableNames.USERS, Key: { userId } })
    );

    if (existing.Item) {
      return ok(existing.Item);
    }

    const now = new Date().toISOString();
    const mobileNumber = typeof claims.phone_number === "string" ? claims.phone_number : "";

    const newUser: UserRecord = {
      userId,
      mobileNumber,
      name: "Customer",
      role: "CUSTOMER",
      accountStatus: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    await ddb.send(new PutCommand({ TableName: TableNames.USERS, Item: newUser }));

    return ok(newUser, 201);
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PUT /me
 * Allows a customer to update their own name/email/address. Role and
 * accountStatus can never be changed from this endpoint.
 */
export async function updateMe(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    const userId = getUserId(event);
    const body = parseBody<{
      name?: string;
      email?: string;
      address?: {
        line1: string;
        line2?: string;
        landmark?: string;
        city: string;
        state: string;
        pincode: string;
      };
    }>(event);

    const existing = await ddb.send(
      new GetCommand({ TableName: TableNames.USERS, Key: { userId } })
    );

    if (!existing.Item) {
      return fail(404, "User profile not found.");
    }

    const current = existing.Item as UserRecord;
    const now = new Date().toISOString();

    const updated: UserRecord = {
      ...current,
      name: body.name ? requireString(body.name, "name", { maxLength: 120 }) : current.name,
      email: body.email ? optionalString(body.email, "email", { maxLength: 160 }) : current.email,
      address: body.address
        ? {
            line1: requireString(body.address.line1, "address.line1", { maxLength: 200 }),
            line2: optionalString(body.address.line2, "address.line2", { maxLength: 200 }),
            landmark: optionalString(body.address.landmark, "address.landmark", { maxLength: 120 }),
            city: requireString(body.address.city, "address.city", { maxLength: 80 }),
            state: requireString(body.address.state, "address.state", { maxLength: 80 }),
            pincode: requireString(body.address.pincode, "address.pincode", { maxLength: 10 }),
          }
        : current.address,
      updatedAt: now,
    };

    await ddb.send(new PutCommand({ TableName: TableNames.USERS, Item: updated }));

    return ok(updated);
  } catch (err) {
    return handleError(err);
  }
}
