import { RemovalPolicy, Stack, type StackProps } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import type { Construct } from "constructs";
import type { EnvironmentConfig } from "./config";

export interface DatabaseStackProps extends StackProps {
  envConfig: EnvironmentConfig;
}

/**
 * DynamoDB tables for the grocery e-commerce platform.
 *
 * One table per entity (Users, Products, Categories, Carts, Orders) rather
 * than a single overloaded table, per the project's explicit data-modeling
 * requirement. All tables use PAY_PER_REQUEST billing since traffic for a
 * single-store deployment is low and spiky, and on-demand billing avoids
 * any capacity-planning/tuning burden.
 */
export class DatabaseStack extends Stack {
  public readonly usersTable: dynamodb.Table;
  public readonly productsTable: dynamodb.Table;
  public readonly categoriesTable: dynamodb.Table;
  public readonly cartsTable: dynamodb.Table;
  public readonly ordersTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    const { envConfig } = props;
    const removalPolicy = envConfig.isProduction ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;

    // --- Users -----------------------------------------------------------
    this.usersTable = new dynamodb.Table(this, "UsersTable", {
      tableName: `sangameshwara-${envConfig.envName}-users`,
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING }, // Cognito sub
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: envConfig.isProduction },
    });
    this.usersTable.addGlobalSecondaryIndex({
      indexName: "MobileNumberIndex",
      partitionKey: { name: "mobileNumber", type: dynamodb.AttributeType.STRING },
    });

    // --- Categories --------------------------------------------------------
    this.categoriesTable = new dynamodb.Table(this, "CategoriesTable", {
      tableName: `sangameshwara-${envConfig.envName}-categories`,
      partitionKey: { name: "categoryId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: envConfig.isProduction },
    });

    // --- Products ------------------------------------------------------
    this.productsTable = new dynamodb.Table(this, "ProductsTable", {
      tableName: `sangameshwara-${envConfig.envName}-products`,
      partitionKey: { name: "productId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: envConfig.isProduction },
    });
    this.productsTable.addGlobalSecondaryIndex({
      indexName: "CategoryIndex",
      partitionKey: { name: "categoryId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "productName", type: dynamodb.AttributeType.STRING },
    });

    // --- Carts -----------------------------------------------------------
    this.cartsTable = new dynamodb.Table(this, "CartsTable", {
      tableName: `sangameshwara-${envConfig.envName}-carts`,
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy,
    });

    // --- Orders ------------------------------------------------------------
    // Also stores per-day atomic order-id counters using keys of the shape
    // "COUNTER#YYYYMMDD" (see backend/src/common/order-utils.ts), which is
    // why real order items are always scanned/queried with a filter on
    // orderId beginning with "ORD-".
    this.ordersTable = new dynamodb.Table(this, "OrdersTable", {
      tableName: `sangameshwara-${envConfig.envName}-orders`,
      partitionKey: { name: "orderId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: envConfig.isProduction },
    });
    this.ordersTable.addGlobalSecondaryIndex({
      indexName: "CustomerIdIndex",
      partitionKey: { name: "customerId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "createdAt", type: dynamodb.AttributeType.STRING },
    });
  }
}
