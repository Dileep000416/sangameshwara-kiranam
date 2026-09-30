import type {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { randomUUID } from "crypto";
import { DeleteCommand, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TableNames } from "@common/dynamo";
import { requireAdmin } from "@common/auth";
import { ApiError, fail, handleError, ok, parseBody } from "@common/http";
import { requireBoolean, requireNumber, requireString, optionalString, slugify } from "@common/validation";
import type { CategoryRecord } from "@common/types";

interface CategoryInput {
  name: string;
  parentGroup: string;
  description?: string;
  imageUrl?: string;
  active?: boolean;
  sortOrder?: number;
}

/** GET /admin/categories - includes inactive categories. */
export async function listAllCategories(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    requireAdmin(event);

    const results: CategoryRecord[] = [];
    let ExclusiveStartKey: Record<string, unknown> | undefined;
    do {
      const response = await ddb.send(
        new ScanCommand({ TableName: TableNames.CATEGORIES, ExclusiveStartKey })
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

/** POST /admin/categories */
export async function createCategory(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    requireAdmin(event);
    const body = parseBody<CategoryInput>(event);

    const name = requireString(body.name, "name", { maxLength: 100 });
    const parentGroup = requireString(body.parentGroup, "parentGroup", { maxLength: 100 });
    const now = new Date().toISOString();
    const categoryId = randomUUID();

    const category: CategoryRecord = {
      categoryId,
      name,
      slug: `${slugify(name)}-${categoryId.slice(0, 6)}`,
      parentGroup,
      description: optionalString(body.description, "description", { maxLength: 500 }),
      imageUrl: optionalString(body.imageUrl, "imageUrl", { maxLength: 1000 }),
      active: requireBoolean(body.active, "active", true),
      sortOrder: body.sortOrder !== undefined ? requireNumber(body.sortOrder, "sortOrder") : 999,
      createdAt: now,
      updatedAt: now,
    };

    await ddb.send(new PutCommand({ TableName: TableNames.CATEGORIES, Item: category }));

    return ok(category, 201);
  } catch (err) {
    return handleError(err);
  }
}

/** PUT /admin/categories/{id} */
export async function updateCategory(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    requireAdmin(event);
    const categoryId = event.pathParameters?.id;
    if (!categoryId) throw new ApiError(400, "Category id is required.");

    const existingResponse = await ddb.send(
      new GetCommand({ TableName: TableNames.CATEGORIES, Key: { categoryId } })
    );
    const existing = existingResponse.Item as CategoryRecord | undefined;
    if (!existing) return fail(404, "Category not found.");

    const body = parseBody<Partial<CategoryInput>>(event);

    const updated: CategoryRecord = {
      ...existing,
      name: body.name ? requireString(body.name, "name", { maxLength: 100 }) : existing.name,
      parentGroup: body.parentGroup
        ? requireString(body.parentGroup, "parentGroup", { maxLength: 100 })
        : existing.parentGroup,
      description:
        body.description !== undefined
          ? optionalString(body.description, "description", { maxLength: 500 })
          : existing.description,
      imageUrl:
        body.imageUrl !== undefined ? optionalString(body.imageUrl, "imageUrl", { maxLength: 1000 }) : existing.imageUrl,
      active: body.active !== undefined ? requireBoolean(body.active, "active") : existing.active,
      sortOrder: body.sortOrder !== undefined ? requireNumber(body.sortOrder, "sortOrder") : existing.sortOrder,
      updatedAt: new Date().toISOString(),
    };

    await ddb.send(new PutCommand({ TableName: TableNames.CATEGORIES, Item: updated }));

    return ok(updated);
  } catch (err) {
    return handleError(err);
  }
}

/** DELETE /admin/categories/{id} */
export async function deleteCategory(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    requireAdmin(event);
    const categoryId = event.pathParameters?.id;
    if (!categoryId) throw new ApiError(400, "Category id is required.");

    await ddb.send(new DeleteCommand({ TableName: TableNames.CATEGORIES, Key: { categoryId } }));

    return ok({ deleted: true, categoryId });
  } catch (err) {
    return handleError(err);
  }
}
