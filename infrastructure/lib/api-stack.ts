import { CfnOutput, Duration, Stack, type StackProps } from "aws-cdk-lib";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as authorizers from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import { RemovalPolicy } from "aws-cdk-lib";
import type { Table } from "aws-cdk-lib/aws-dynamodb";
import type { Bucket } from "aws-cdk-lib/aws-s3";
import type { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import type { Construct } from "constructs";
import * as path from "path";
import type { EnvironmentConfig } from "./config";

export interface ApiStackProps extends StackProps {
  envConfig: EnvironmentConfig;
  usersTable: Table;
  productsTable: Table;
  categoriesTable: Table;
  cartsTable: Table;
  ordersTable: Table;
  productImagesBucket: Bucket;
  userPool: UserPool;
  userPoolClient: UserPoolClient;
}

const BACKEND_ROOT = path.join(__dirname, "..", "..", "backend");
const BACKEND_SRC = path.join(BACKEND_ROOT, "src");

/**
 * API Gateway HTTP API fronting all Lambda functions.
 *
 * - Public routes (products/categories browsing) have no authorizer.
 * - Customer routes (/me, /cart, /orders) require a valid Cognito JWT.
 * - Admin routes (/admin/*) also require a valid JWT; the ADMINS-group
 *   check happens inside each Lambda (requireAdmin in backend/src/common/auth.ts)
 *   using the verified "cognito:groups" claim, never a client-supplied value.
 */
export class ApiStack extends Stack {
  public readonly httpApi: apigwv2.HttpApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const {
      envConfig,
      usersTable,
      productsTable,
      categoriesTable,
      cartsTable,
      ordersTable,
      productImagesBucket,
      userPool,
      userPoolClient,
    } = props;

    const commonEnv = {
      USER_TABLE_NAME: usersTable.tableName,
      PRODUCT_TABLE_NAME: productsTable.tableName,
      CATEGORY_TABLE_NAME: categoriesTable.tableName,
      CART_TABLE_NAME: cartsTable.tableName,
      ORDER_TABLE_NAME: ordersTable.tableName,
      PRODUCT_BUCKET_NAME: productImagesBucket.bucketName,
      ADMIN_WHATSAPP_NUMBER: envConfig.adminWhatsappNumber,
      CORS_ALLOWED_ORIGIN: envConfig.corsAllowedOrigin,
    };

    const nodeJsDefaults: Partial<lambda.NodejsFunctionProps> = {
      runtime: Runtime.NODEJS_22_X,
      projectRoot: BACKEND_ROOT,
      depsLockFilePath: path.join(BACKEND_ROOT, "package-lock.json"),
      bundling: {
        externalModules: ["@aws-sdk/*"],
        tsconfig: path.join(BACKEND_ROOT, "tsconfig.json"),
      },
      environment: commonEnv,
      timeout: Duration.seconds(15),
      memorySize: 256,
    };

    const makeFn = (id: string, entry: string, exportName?: string) =>
      new lambda.NodejsFunction(this, id, {
        ...nodeJsDefaults,
        entry: path.join(BACKEND_SRC, entry),
        handler: exportName ?? "handler",
        logGroup: new logs.LogGroup(this, `${id}Logs`, {
          retention: logs.RetentionDays.TWO_WEEKS,
          removalPolicy: RemovalPolicy.DESTROY,
        }),
      });

    // --- Public functions --------------------------------------------------
    const listProductsFn = makeFn("ListProductsFn", "functions/products/list.ts");
    const getProductFn = makeFn("GetProductFn", "functions/products/get.ts");
    const listCategoriesFn = makeFn("ListCategoriesFn", "functions/categories/list.ts");

    // --- Customer functions (require auth) ----------------------------
    const getMeFn = makeFn("GetMeFn", "functions/users/me.ts", "getMe");
    const updateMeFn = makeFn("UpdateMeFn", "functions/users/me.ts", "updateMe");
    const getCartFn = makeFn("GetCartFn", "functions/cart/handler.ts", "getCart");
    const addToCartFn = makeFn("AddToCartFn", "functions/cart/handler.ts", "addToCart");
    const updateCartItemFn = makeFn("UpdateCartItemFn", "functions/cart/handler.ts", "updateCartItem");
    const removeFromCartFn = makeFn("RemoveFromCartFn", "functions/cart/handler.ts", "removeFromCart");
    const createOrderFn = makeFn("CreateOrderFn", "functions/orders/create.ts");
    const listMyOrdersFn = makeFn("ListMyOrdersFn", "functions/orders/list.ts", "listMyOrders");
    const getMyOrderFn = makeFn("GetMyOrderFn", "functions/orders/list.ts", "getMyOrder");

    // --- Admin functions (require auth + ADMINS group) ---------------------
    const listAllProductsFn = makeFn("ListAllProductsFn", "functions/admin/products.ts", "listAllProducts");
    const createProductFn = makeFn("CreateProductFn", "functions/admin/products.ts", "createProduct");
    const updateProductFn = makeFn("UpdateProductFn", "functions/admin/products.ts", "updateProduct");
    const deleteProductFn = makeFn("DeleteProductFn", "functions/admin/products.ts", "deleteProduct");
    const updateStockFn = makeFn("UpdateStockFn", "functions/admin/products.ts", "updateStock");
    const listAllCategoriesFn = makeFn("ListAllCategoriesFn", "functions/admin/categories.ts", "listAllCategories");
    const createCategoryFn = makeFn("CreateCategoryFn", "functions/admin/categories.ts", "createCategory");
    const updateCategoryFn = makeFn("UpdateCategoryFn", "functions/admin/categories.ts", "updateCategory");
    const deleteCategoryFn = makeFn("DeleteCategoryFn", "functions/admin/categories.ts", "deleteCategory");
    const listAllOrdersFn = makeFn("ListAllOrdersFn", "functions/admin/orders.ts", "listAllOrders");
    const getOrderFn = makeFn("GetOrderAdminFn", "functions/admin/orders.ts", "getOrder");
    const updateOrderStatusFn = makeFn("UpdateOrderStatusFn", "functions/admin/orders.ts", "updateOrderStatus");
    const dashboardFn = makeFn("DashboardFn", "functions/admin/dashboard.ts");
    const uploadUrlFn = makeFn("UploadUrlFn", "functions/admin/upload-url.ts");

    // --- IAM permissions -----------------------------------------------
    productsTable.grantReadData(listProductsFn);
    productsTable.grantReadData(getProductFn);
    categoriesTable.grantReadData(listCategoriesFn);

    usersTable.grantReadWriteData(getMeFn);
    usersTable.grantReadWriteData(updateMeFn);

    cartsTable.grantReadWriteData(getCartFn);
    productsTable.grantReadData(getCartFn);
    cartsTable.grantReadWriteData(addToCartFn);
    productsTable.grantReadData(addToCartFn);
    cartsTable.grantReadWriteData(updateCartItemFn);
    productsTable.grantReadData(updateCartItemFn);
    cartsTable.grantReadWriteData(removeFromCartFn);

    cartsTable.grantReadWriteData(createOrderFn);
    productsTable.grantReadWriteData(createOrderFn);
    ordersTable.grantReadWriteData(createOrderFn);
    ordersTable.grantReadData(listMyOrdersFn);
    ordersTable.grantReadData(getMyOrderFn);

    productsTable.grantReadWriteData(listAllProductsFn);
    productsTable.grantReadWriteData(createProductFn);
    productsTable.grantReadWriteData(updateProductFn);
    productsTable.grantReadWriteData(deleteProductFn);
    productsTable.grantReadWriteData(updateStockFn);

    categoriesTable.grantReadWriteData(listAllCategoriesFn);
    categoriesTable.grantReadWriteData(createCategoryFn);
    categoriesTable.grantReadWriteData(updateCategoryFn);
    categoriesTable.grantReadWriteData(deleteCategoryFn);

    ordersTable.grantReadWriteData(listAllOrdersFn);
    ordersTable.grantReadWriteData(getOrderFn);
    ordersTable.grantReadWriteData(updateOrderStatusFn);

    productsTable.grantReadData(dashboardFn);
    ordersTable.grantReadData(dashboardFn);
    usersTable.grantReadData(dashboardFn);

    productImagesBucket.grantPut(uploadUrlFn);

    // --- HTTP API ------------------------------------------------------
    this.httpApi = new apigwv2.HttpApi(this, "HttpApi", {
      apiName: `sangameshwara-${envConfig.envName}-api`,
      corsPreflight: {
        allowOrigins: [envConfig.corsAllowedOrigin],
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: [
          apigwv2.CorsHttpMethod.GET,
          apigwv2.CorsHttpMethod.POST,
          apigwv2.CorsHttpMethod.PUT,
          apigwv2.CorsHttpMethod.DELETE,
          apigwv2.CorsHttpMethod.OPTIONS,
        ],
        maxAge: Duration.days(1),
      },
    });

    const jwtAuthorizer = new authorizers.HttpJwtAuthorizer(
      "CognitoJwtAuthorizer",
      `https://cognito-idp.${this.region}.amazonaws.com/${userPool.userPoolId}`,
      {
        jwtAudience: [userPoolClient.userPoolClientId],
      }
    );

    const addRoute = (
      routeKey: string,
      methods: apigwv2.HttpMethod[],
      fn: lambda.NodejsFunction,
      requireAuth: boolean
    ) => {
      this.httpApi.addRoutes({
        path: routeKey,
        methods,
        integration: new integrations.HttpLambdaIntegration(`${routeKey}Integration${methods.join("")}`, fn),
        authorizer: requireAuth ? jwtAuthorizer : undefined,
      });
    };

    // Public
    addRoute("/products", [apigwv2.HttpMethod.GET], listProductsFn, false);
    addRoute("/products/{id}", [apigwv2.HttpMethod.GET], getProductFn, false);
    addRoute("/categories", [apigwv2.HttpMethod.GET], listCategoriesFn, false);

    // Customer (authenticated)
    addRoute("/me", [apigwv2.HttpMethod.GET], getMeFn, true);
    addRoute("/me", [apigwv2.HttpMethod.PUT], updateMeFn, true);
    addRoute("/cart", [apigwv2.HttpMethod.GET], getCartFn, true);
    addRoute("/cart", [apigwv2.HttpMethod.POST], addToCartFn, true);
    addRoute("/cart/{productId}", [apigwv2.HttpMethod.PUT], updateCartItemFn, true);
    addRoute("/cart/{productId}", [apigwv2.HttpMethod.DELETE], removeFromCartFn, true);
    addRoute("/orders", [apigwv2.HttpMethod.POST], createOrderFn, true);
    addRoute("/orders", [apigwv2.HttpMethod.GET], listMyOrdersFn, true);
    addRoute("/orders/{orderId}", [apigwv2.HttpMethod.GET], getMyOrderFn, true);

    // Admin (authenticated + ADMINS group checked in-Lambda)
    addRoute("/admin/products", [apigwv2.HttpMethod.GET], listAllProductsFn, true);
    addRoute("/admin/products", [apigwv2.HttpMethod.POST], createProductFn, true);
    addRoute("/admin/products/{id}", [apigwv2.HttpMethod.PUT], updateProductFn, true);
    addRoute("/admin/products/{id}", [apigwv2.HttpMethod.DELETE], deleteProductFn, true);
    addRoute("/admin/products/{id}/stock", [apigwv2.HttpMethod.PUT], updateStockFn, true);
    addRoute("/admin/products/upload-url", [apigwv2.HttpMethod.POST], uploadUrlFn, true);
    addRoute("/admin/categories", [apigwv2.HttpMethod.GET], listAllCategoriesFn, true);
    addRoute("/admin/categories", [apigwv2.HttpMethod.POST], createCategoryFn, true);
    addRoute("/admin/categories/{id}", [apigwv2.HttpMethod.PUT], updateCategoryFn, true);
    addRoute("/admin/categories/{id}", [apigwv2.HttpMethod.DELETE], deleteCategoryFn, true);
    addRoute("/admin/orders", [apigwv2.HttpMethod.GET], listAllOrdersFn, true);
    addRoute("/admin/orders/{id}", [apigwv2.HttpMethod.GET], getOrderFn, true);
    addRoute("/admin/orders/{id}", [apigwv2.HttpMethod.PUT], updateOrderStatusFn, true);
    addRoute("/admin/dashboard", [apigwv2.HttpMethod.GET], dashboardFn, true);

    new CfnOutput(this, "ApiUrl", {
      value: this.httpApi.apiEndpoint,
      description: "Base URL for the deployed API Gateway HTTP API. Set this as NEXT_PUBLIC_API_URL in the frontend.",
    });
  }
}
