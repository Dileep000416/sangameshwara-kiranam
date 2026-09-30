import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TableNames } from "@common/dynamo";
import { ApiError, fail, handleError, ok } from "@common/http";
import type { ProductRecord } from "@common/types";

/** GET /products/{id} */
export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    const productId = event.pathParameters?.id;
    if (!productId) {
      throw new ApiError(400, "Product id is required.");
    }

    const response = await ddb.send(
      new GetCommand({
        TableName: TableNames.PRODUCTS,
        Key: { productId },
      })
    );

    const product = response.Item as ProductRecord | undefined;

    if (!product || !product.active) {
      return fail(404, "Product not found.");
    }

    return ok(product);
  } catch (err) {
    return handleError(err);
  }
}
