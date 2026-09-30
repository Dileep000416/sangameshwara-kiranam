import type {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TableNames } from "@common/dynamo";
import { requireAdmin } from "@common/auth";
import { handleError, ok } from "@common/http";
import type { OrderRecord, ProductRecord } from "@common/types";

async function scanAll<T>(tableName: string, filter?: { expression: string; values: Record<string, unknown> }): Promise<T[]> {
  const results: T[] = [];
  let ExclusiveStartKey: Record<string, unknown> | undefined;
  do {
    const response = await ddb.send(
      new ScanCommand({
        TableName: tableName,
        FilterExpression: filter?.expression,
        ExpressionAttributeValues: filter?.values,
        ExclusiveStartKey,
      })
    );
    results.push(...((response.Items as T[]) ?? []));
    ExclusiveStartKey = response.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return results;
}

/**
 * GET /admin/dashboard
 * Aggregates the metrics shown on the admin dashboard (spec section 19).
 * Uses table scans, which is acceptable at the current catalog/order scale;
 * for a much larger deployment this should move to precomputed counters
 * (e.g. DynamoDB Streams -> aggregation table).
 */
export async function handler(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    requireAdmin(event);

    const [products, orders, users] = await Promise.all([
      scanAll<ProductRecord>(TableNames.PRODUCTS),
      scanAll<OrderRecord>(TableNames.ORDERS, {
        expression: "begins_with(orderId, :prefix)",
        values: { ":prefix": "ORD-" },
      }),
      scanAll<{ role: string }>(TableNames.USERS),
    ]);

    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.active).length;
    const outOfStockProducts = products.filter((p) => !p.inStock || p.stockQuantity <= 0).length;

    const totalCustomers = users.filter((u) => u.role === "CUSTOMER").length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) =>
      ["CREATED", "WHATSAPP_REDIRECTED", "CONFIRMED", "PACKING", "OUT_FOR_DELIVERY"].includes(o.status)
    ).length;

    const todayStr = new Date().toISOString().slice(0, 10);
    const todaysOrders = orders.filter((o) => o.createdAt.slice(0, 10) === todayStr);
    const todaysOrderValue = todaysOrders.reduce((sum, o) => sum + o.total, 0);

    return ok({
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalCustomers,
      totalOrders,
      pendingOrders,
      todaysOrders: todaysOrders.length,
      todaysOrderValue,
    });
  } catch (err) {
    return handleError(err);
  }
}
