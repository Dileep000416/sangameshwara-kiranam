import type {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { GetCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TableNames } from "@common/dynamo";
import { requireAdmin } from "@common/auth";
import { ApiError, fail, handleError, ok, parseBody } from "@common/http";
import { requireString } from "@common/validation";
import type { OrderRecord, OrderStatus } from "@common/types";

const VALID_STATUSES: OrderStatus[] = [
  "CREATED",
  "WHATSAPP_REDIRECTED",
  "CONFIRMED",
  "PACKING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

/** GET /admin/orders - all orders, newest first. Skips internal per-day counter items. */
export async function listAllOrders(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    requireAdmin(event);

    const results: OrderRecord[] = [];
    let ExclusiveStartKey: Record<string, unknown> | undefined;
    do {
      const response = await ddb.send(
        new ScanCommand({
          TableName: TableNames.ORDERS,
          FilterExpression: "begins_with(orderId, :prefix)",
          ExpressionAttributeValues: { ":prefix": "ORD-" },
          ExclusiveStartKey,
        })
      );
      results.push(...((response.Items as OrderRecord[]) ?? []));
      ExclusiveStartKey = response.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return ok({ items: results });
  } catch (err) {
    return handleError(err);
  }
}

/** GET /admin/orders/{id} */
export async function getOrder(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    requireAdmin(event);
    const orderId = event.pathParameters?.id;
    if (!orderId) throw new ApiError(400, "Order id is required.");

    const response = await ddb.send(
      new GetCommand({ TableName: TableNames.ORDERS, Key: { orderId } })
    );
    if (!response.Item) return fail(404, "Order not found.");

    return ok(response.Item);
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PUT /admin/orders/{id}
 * Body: { status }
 * Only an admin may transition an order's status (e.g. to DELIVERED).
 * A customer-facing endpoint for this does not exist.
 */
export async function updateOrderStatus(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    requireAdmin(event);
    const orderId = event.pathParameters?.id;
    if (!orderId) throw new ApiError(400, "Order id is required.");

    const body = parseBody<{ status: string }>(event);
    const status = requireString(body.status, "status") as OrderStatus;

    if (!VALID_STATUSES.includes(status)) {
      throw new ApiError(400, `status must be one of: ${VALID_STATUSES.join(", ")}`);
    }

    try {
      const response = await ddb.send(
        new UpdateCommand({
          TableName: TableNames.ORDERS,
          Key: { orderId },
          UpdateExpression: "SET #status = :status, updatedAt = :now",
          ConditionExpression: "attribute_exists(orderId)",
          ExpressionAttributeNames: { "#status": "status" },
          ExpressionAttributeValues: {
            ":status": status,
            ":now": new Date().toISOString(),
          },
          ReturnValues: "ALL_NEW",
        })
      );
      return ok(response.Attributes);
    } catch (err) {
      if (isConditionalCheckFailed(err)) {
        return fail(404, "Order not found.");
      }
      throw err;
    }
  } catch (err) {
    return handleError(err);
  }
}

function isConditionalCheckFailed(err: unknown): boolean {
  return typeof err === "object" && err !== null && "name" in err && (err as { name?: string }).name === "ConditionalCheckFailedException";
}
