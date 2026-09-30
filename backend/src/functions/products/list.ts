import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TableNames } from "@common/dynamo";
import { handleError, ok } from "@common/http";
import type { ProductRecord } from "@common/types";

/**
 * GET /products
 * Query params:
 *   category  - filter by categoryId
 *   search    - free-text search across name, brand, category
 *   featured  - "true" to only return featured products
 *   page      - 1-indexed page number (default 1)
 *   pageSize  - items per page (default 24, max 60)
 *
 * The catalog is expected to stay in the low thousands of items, so a full
 * table scan with in-memory filtering/pagination keeps the implementation
 * simple while still returning paginated pages. For a much larger catalog,
 * swap this for an OpenSearch/Algolia-backed search index.
 */
export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    const query = event.queryStringParameters ?? {};
    const category = query.category?.trim();
    const search = query.search?.trim().toLowerCase();
    const featuredOnly = query.featured === "true";
    const page = Math.max(1, Number(query.page ?? 1) || 1);
    const pageSize = Math.min(60, Math.max(1, Number(query.pageSize ?? 24) || 24));

    const items = await scanAllActiveProducts();

    let filtered = items;

    if (category) {
      filtered = filtered.filter((p) => p.categoryId === category);
    }

    if (featuredOnly) {
      filtered = filtered.filter((p) => p.featured);
    }

    if (search) {
      filtered = filtered.filter((p) => {
        const haystack = [p.productName, p.brand, p.categoryName, ...(p.searchKeywords ?? [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    filtered.sort((a, b) => a.productName.localeCompare(b.productName));

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);

    return ok({
      items: pageItems,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    });
  } catch (err) {
    return handleError(err);
  }
}

async function scanAllActiveProducts(): Promise<ProductRecord[]> {
  const results: ProductRecord[] = [];
  let ExclusiveStartKey: Record<string, unknown> | undefined;

  do {
    const response = await ddb.send(
      new ScanCommand({
        TableName: TableNames.PRODUCTS,
        FilterExpression: "active = :active",
        ExpressionAttributeValues: { ":active": true },
        ExclusiveStartKey,
      })
    );
    results.push(...((response.Items as ProductRecord[]) ?? []));
    ExclusiveStartKey = response.LastEvaluatedKey;
  } while (ExclusiveStartKey);

  return results;
}
