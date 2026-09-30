/**
 * Seeds the Categories and Products DynamoDB tables with demo data.
 *
 * Usage (from scripts/seed/):
 *   npm install
 *   CATEGORY_TABLE_NAME=sangameshwara-dev-categories \
 *   PRODUCT_TABLE_NAME=sangameshwara-dev-products \
 *   AWS_REGION=ap-south-1 \
 *   npm run seed
 *
 * Table names come from the CDK stack outputs (or the CloudFormation
 * console) once infrastructure/ has been deployed. This script is
 * idempotent for categories (matched by slug) but will create duplicate
 * products if run twice, since products are identified by a freshly
 * generated UUID each time — re-running is only intended for a fresh
 * environment.
 */
import { randomUUID } from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { seedCategories } from "./categories-data";
import { seedProducts } from "./products-data";

const REGION = process.env.AWS_REGION || "ap-south-1";
const CATEGORY_TABLE_NAME = process.env.CATEGORY_TABLE_NAME;
const PRODUCT_TABLE_NAME = process.env.PRODUCT_TABLE_NAME;

if (!CATEGORY_TABLE_NAME || !PRODUCT_TABLE_NAME) {
  console.error(
    "Missing required environment variables. Please set CATEGORY_TABLE_NAME and PRODUCT_TABLE_NAME " +
      "(see the CDK stack outputs after deploying infrastructure/)."
  );
  process.exit(1);
}

const client = new DynamoDBClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(client);

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function computeDiscount(price: number, originalPrice: number): number {
  if (originalPrice <= 0 || price >= originalPrice) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

async function batchWriteAll(tableName: string, items: Record<string, unknown>[]) {
  const BATCH_SIZE = 25; // DynamoDB BatchWriteItem limit
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    await ddb.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: batch.map((item) => ({ PutRequest: { Item: item } })),
        },
      })
    );
    console.log(`  Wrote ${Math.min(i + BATCH_SIZE, items.length)}/${items.length} items to ${tableName}`);
  }
}

async function main() {
  const now = new Date().toISOString();

  console.log(`Seeding ${seedCategories.length} categories into ${CATEGORY_TABLE_NAME}...`);

  const categoryIdBySlug = new Map<string, string>();
  const categoryNameBySlug = new Map<string, string>();

  const categoryItems = seedCategories.map((category, index) => {
    const categoryId = randomUUID();
    categoryIdBySlug.set(category.slug, categoryId);
    categoryNameBySlug.set(category.slug, category.name);

    return {
      categoryId,
      name: category.name,
      slug: `${slugify(category.name)}-${categoryId.slice(0, 6)}`,
      parentGroup: category.parentGroup,
      description: category.description,
      active: true,
      sortOrder: index,
      createdAt: now,
      updatedAt: now,
    };
  });

  await batchWriteAll(CATEGORY_TABLE_NAME!, categoryItems);

  console.log(`Seeding ${seedProducts.length} products into ${PRODUCT_TABLE_NAME}...`);

  const productItems = seedProducts.map((product) => {
    const categoryId = categoryIdBySlug.get(product.categorySlug);
    const categoryName = categoryNameBySlug.get(product.categorySlug);

    if (!categoryId || !categoryName) {
      throw new Error(`Unknown categorySlug "${product.categorySlug}" for product "${product.productName}"`);
    }

    const productId = randomUUID();
    const stockQuantity = 25 + Math.floor(Math.random() * 75); // 25-99 units in stock

    return {
      productId,
      slug: `${slugify(product.productName)}-${productId.slice(0, 6)}`,
      productName: product.productName,
      description: `${product.productName}${product.brand ? ` by ${product.brand}` : ""}, ${product.unit}.`,
      categoryId,
      categoryName,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: computeDiscount(product.price, product.originalPrice),
      unit: product.unit,
      stockQuantity,
      inStock: stockQuantity > 0,
      featured: Boolean(product.featured),
      active: true,
      searchKeywords: [product.productName, product.brand, categoryName]
        .filter(Boolean)
        .flatMap((s) => (s as string).toLowerCase().split(/\s+/)),
      createdAt: now,
      updatedAt: now,
    };
  });

  await batchWriteAll(PRODUCT_TABLE_NAME!, productItems);

  console.log("\nSeed complete:");
  console.log(`  ${categoryItems.length} categories`);
  console.log(`  ${productItems.length} products`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
