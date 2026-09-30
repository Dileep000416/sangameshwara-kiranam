import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

export const ddb = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const TableNames = {
  get USERS() {
    return requireEnv("USER_TABLE_NAME");
  },
  get PRODUCTS() {
    return requireEnv("PRODUCT_TABLE_NAME");
  },
  get CATEGORIES() {
    return requireEnv("CATEGORY_TABLE_NAME");
  },
  get CARTS() {
    return requireEnv("CART_TABLE_NAME");
  },
  get ORDERS() {
    return requireEnv("ORDER_TABLE_NAME");
  },
};
