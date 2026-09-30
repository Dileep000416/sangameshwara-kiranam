import type {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TableNames } from "@common/dynamo";
import { getUserId } from "@common/auth";
import { ApiError, fail, handleError, ok } from "@common/http";
import type { OrderRecord } from "@common/types";

/**
 * GET /orders
 * Returns only the authenticated customer's own orders, via the
 * CustomerIdIndex GSI (customerId -> createdAt). A customer can never see
 * another customer's orders because customerId always comes from the JWT.
 */
export async function listMyOrders(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    const userId = getUserId(event);

    const response = await ddb.send(
      new QueryCommand({
        TableName: TableNames.ORDERS,
        IndexName: "CustomerIdIndex",
        KeyConditionExpression: "customerId = :customerId",
        ExpressionAttributeValues: { ":customerId": userId },
        ScanIndexForward: false,
      })
    );

    return ok({ items: response.Items ?? [] });
  } catch (err) {
    return handleError(err);
  }
}

/** GET /orders/{orderId} - a customer may only view their own order. */
export async function getMyOrder(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    const userId = getUserId(event);
    const orderId = event.pathParameters?.orderId;
    if (!orderId) {
      throw new ApiError(400, "orderId is required.");
    }

    const response = await ddb.send(
      new GetCommand({ TableName: TableNames.ORDERS, Key: { orderId } })
    );
    const order = response.Item as OrderRecord | undefined;

    if (!order || order.customerId !== userId) {
      return fail(404, "Order not found.");
    }

    return ok(order);
  } catch (err) {
    return handleError(err);
  }
}
