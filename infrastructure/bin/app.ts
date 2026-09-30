#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { getEnvironmentConfig } from "../lib/config";
import { DatabaseStack } from "../lib/database-stack";
import { StorageStack } from "../lib/storage-stack";
import { AuthStack } from "../lib/auth-stack";
import { ApiStack } from "../lib/api-stack";
import { FrontendStack } from "../lib/frontend-stack";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new App();

const envConfig = getEnvironmentConfig(app);

const env = {
  account: envConfig.awsAccount || undefined,
  region: envConfig.awsRegion,
};

const stackPrefix = `Sangameshwara-${envConfig.envName}`;

const databaseStack = new DatabaseStack(app, `${stackPrefix}-Database`, { env, envConfig });

const storageStack = new StorageStack(app, `${stackPrefix}-Storage`, { env, envConfig });

const authStack = new AuthStack(app, `${stackPrefix}-Auth`, {
  env,
  envConfig,
  usersTable: databaseStack.usersTable,
});

const apiStack = new ApiStack(app, `${stackPrefix}-Api`, {
  env,
  envConfig,
  usersTable: databaseStack.usersTable,
  productsTable: databaseStack.productsTable,
  categoriesTable: databaseStack.categoriesTable,
  cartsTable: databaseStack.cartsTable,
  ordersTable: databaseStack.ordersTable,
  productImagesBucket: storageStack.productImagesBucket,
  userPool: authStack.userPool,
  userPoolClient: authStack.userPoolClient,
});

const frontendStack = new FrontendStack(app, `${stackPrefix}-Frontend`, {
  env,
  envConfig,
});

// The pipeline stack is a no-op (synthesizes with no resources) until a
// GitHub CodeStar Connections ARN is supplied via context/env — see
// infrastructure/lib/pipeline-stack.ts and the README's CI/CD section.
new PipelineStack(app, `${stackPrefix}-Pipeline`, {
  env,
  envConfig,
  frontendBucket: frontendStack.frontendBucket,
  distribution: frontendStack.distribution,
  githubConnectionArn: app.node.tryGetContext("githubConnectionArn") || process.env.GITHUB_CONNECTION_ARN,
  githubOwner: app.node.tryGetContext("githubOwner") || process.env.GITHUB_OWNER,
  githubRepo: app.node.tryGetContext("githubRepo") || process.env.GITHUB_REPO,
  githubBranch: app.node.tryGetContext("githubBranch") || process.env.GITHUB_BRANCH,
});

apiStack.addStackDependency(databaseStack);
apiStack.addStackDependency(storageStack);
apiStack.addStackDependency(authStack);
