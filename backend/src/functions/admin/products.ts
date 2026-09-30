import type {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { randomUUID } from "crypto";
import { DeleteCommand, GetCommand, PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TableNames } from "@common/dynamo";
import { requireAdmin } from "@common/auth";
import { ApiError, fail, handleError, ok, parseBody } from "@common/http";
import { requireBoolean, requireNumber, requireString, optionalString, slugify } from "@common/validation";
import type { ProductRecord } from "@common/types";

interface ProductInput {
  productName: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  brand?: string;
  price: number;
  originalPrice: number;
  unit: string;
  imageUrl?: string;
  imageKey?: string;
  stockQuantity: number;
  featured?: boolean;
  active?: boolean;
}

function computeDiscount(price: number, originalPrice: number): number {
  if (originalPrice <= 0 || price >= originalPrice) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function buildSearchKeywords(input: { productName: string; brand?: string; categoryName: string }): string[] {
  const tokens = new Set<string>();
  for (const source of [input.productName, input.brand, input.categoryName]) {
    if (!source) continue;
    for (const word of source.toLowerCase().split(/\s+/)) {
      if (word) tokens.add(word);
    }
  }
  return Array.from(tokens);
}

/** GET /admin/products - full list including inactive/out-of-stock, for the admin table. */
export async function listAllProducts(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    requireAdmin(event);

    const results: ProductRecord[] = [];
    let ExclusiveStartKey: Record<string, unknown> | undefined;
    do {
      const response = await ddb.send(
        new ScanCommand({ TableName: TableNames.PRODUCTS, ExclusiveStartKey })
      );
      results.push(...((response.Items as ProductRecord[]) ?? []));
      ExclusiveStartKey = response.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return ok({ items: results });
  } catch (err) {
    return handleError(err);
  }
}

/** POST /admin/products */
export async function createProduct(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    requireAdmin(event);
    const body = parseBody<ProductInput>(event);

    const productName = requireString(body.productName, "productName", { maxLength: 160 });
    const price = requireNumber(body.price, "price", { min: 0 });
    const originalPrice = requireNumber(body.originalPrice, "originalPrice", { min: 0 });
    const stockQuantity = requireNumber(body.stockQuantity, "stockQuantity", { min: 0 });
    const categoryId = requireString(body.categoryId, "categoryId");
    const categoryName = requireString(body.categoryName, "categoryName");
    const unit = requireString(body.unit, "unit", { maxLength: 40 });
    const brand = optionalString(body.brand, "brand", { maxLength: 80 });
    const description = optionalString(body.description, "description", { maxLength: 2000 });

    const now = new Date().toISOString();
    const productId = randomUUID();

    const product: ProductRecord = {
      productId,
      slug: `${slugify(productName)}-${productId.slice(0, 6)}`,
      productName,
      description,
      categoryId,
      categoryName,
      brand,
      price,
      originalPrice,
      discount: computeDiscount(price, originalPrice),
      unit,
      imageUrl: optionalString(body.imageUrl, "imageUrl", { maxLength: 1000 }),
      imageKey: optionalString(body.imageKey, "imageKey", { maxLength: 500 }),
      stockQuantity,
      inStock: stockQuantity > 0,
      featured: requireBoolean(body.featured, "featured", false),
      active: requireBoolean(body.active, "active", true),
      searchKeywords: buildSearchKeywords({ productName, brand, categoryName }),
      createdAt: now,
      updatedAt: now,
    };

    await ddb.send(new PutCommand({ TableName: TableNames.PRODUCTS, Item: product }));

    return ok(product, 201);
  } catch (err) {
    return handleError(err);
  }
}

/** PUT /admin/products/{id} */
export async function updateProduct(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    requireAdmin(event);
    const productId = event.pathParameters?.id;
    if (!productId) throw new ApiError(400, "Product id is required.");

    const existingResponse = await ddb.send(
      new GetCommand({ TableName: TableNames.PRODUCTS, Key: { productId } })
    );
    const existing = existingResponse.Item as ProductRecord | undefined;
    if (!existing) return fail(404, "Product not found.");

    const body = parseBody<Partial<ProductInput>>(event);

    const productName = body.productName
      ? requireString(body.productName, "productName", { maxLength: 160 })
      : existing.productName;
    const price = body.price !== undefined ? requireNumber(body.price, "price", { min: 0 }) : existing.price;
    const originalPrice =
      body.originalPrice !== undefined
        ? requireNumber(body.originalPrice, "originalPrice", { min: 0 })
        : existing.originalPrice;
    const stockQuantity =
      body.stockQuantity !== undefined
        ? requireNumber(body.stockQuantity, "stockQuantity", { min: 0 })
        : existing.stockQuantity;
    const categoryId = body.categoryId ? requireString(body.categoryId, "categoryId") : existing.categoryId;
    const categoryName = body.categoryName
      ? requireString(body.categoryName, "categoryName")
      : existing.categoryName;
    const unit = body.unit ? requireString(body.unit, "unit", { maxLength: 40 }) : existing.unit;
    const brand = body.brand !== undefined ? optionalString(body.brand, "brand", { maxLength: 80 }) : existing.brand;
    const description =
      body.description !== undefined
        ? optionalString(body.description, "description", { maxLength: 2000 })
        : existing.description;

    const updated: ProductRecord = {
      ...existing,
      productName,
      description,
      categoryId,
      categoryName,
      brand,
      price,
      originalPrice,
      discount: computeDiscount(price, originalPrice),
      unit,
      imageUrl: body.imageUrl !== undefined ? optionalString(body.imageUrl, "imageUrl", { maxLength: 1000 }) : existing.imageUrl,
      imageKey: body.imageKey !== undefined ? optionalString(body.imageKey, "imageKey", { maxLength: 500 }) : existing.imageKey,
      stockQuantity,
      inStock: stockQuantity > 0,
      featured: body.featured !== undefined ? requireBoolean(body.featured, "featured") : existing.featured,
      active: body.active !== undefined ? requireBoolean(body.active, "active") : existing.active,
      searchKeywords: buildSearchKeywords({ productName, brand, categoryName }),
      updatedAt: new Date().toISOString(),
    };

    await ddb.send(new PutCommand({ TableName: TableNames.PRODUCTS, Item: updated }));

    return ok(updated);
  } catch (err) {
    return handleError(err);
  }
}

/** DELETE /admin/products/{id} */
export async function deleteProduct(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    requireAdmin(event);
    const productId = event.pathParameters?.id;
    if (!productId) throw new ApiError(400, "Product id is required.");

    await ddb.send(new DeleteCommand({ TableName: TableNames.PRODUCTS, Key: { productId } }));

    return ok({ deleted: true, productId });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PUT /admin/products/{id}/stock
 * Convenience endpoint for quick stock adjustments from the admin table
 * without needing to resend the entire product payload.
 */
export async function updateStock(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    requireAdmin(event);
    const productId = event.pathParameters?.id;
    if (!productId) throw new ApiError(400, "Product id is required.");

    const body = parseBody<{ stockQuantity: number }>(event);
    const stockQuantity = requireNumber(body.stockQuantity, "stockQuantity", { min: 0 });

    try {
      const response = await ddb.send(
        new UpdateCommand({
          TableName: TableNames.PRODUCTS,
          Key: { productId },
          UpdateExpression: "SET stockQuantity = :qty, inStock = :inStock, updatedAt = :now",
          ConditionExpression: "attribute_exists(productId)",
          ExpressionAttributeValues: {
            ":qty": stockQuantity,
            ":inStock": stockQuantity > 0,
            ":now": new Date().toISOString(),
          },
          ReturnValues: "ALL_NEW",
        })
      );
      return ok(response.Attributes);
    } catch (err) {
      if (isConditionalCheckFailed(err)) {
        return fail(404, "Product not found.");
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
