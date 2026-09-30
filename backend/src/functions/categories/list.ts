import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TableNames } from "@common/dynamo";
import { handleError, ok } from "@common/http";
import type { CategoryRecord } from "@common/types";

/** GET /categories - returns active categories sorted by sortOrder. */
export async function handler(
  _event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    const results: CategoryRecord[] = [];
    let ExclusiveStartKey: Record<string, unknown> | undefined;

    do {
      const response = await ddb.send(
        new ScanCommand({
          TableName: TableNames.CATEGORIES,
          FilterExpression: "active = :active",
          ExpressionAttributeValues: { ":active": true },
          ExclusiveStartKey,
        })
      );
      results.push(...((response.Items as CategoryRecord[]) ?? []));
      ExclusiveStartKey = response.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    results.sort((a, b) => a.sortOrder - b.sortOrder);

    return ok({ items: results });
  } catch (err) {
    return handleError(err);
  }
}
