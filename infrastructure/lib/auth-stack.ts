import { Duration, RemovalPolicy, Stack, type StackProps } from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";
import * as path from "path";
import type { Table } from "aws-cdk-lib/aws-dynamodb";
import type { EnvironmentConfig } from "./config";

export interface AuthStackProps extends StackProps {
  envConfig: EnvironmentConfig;
  usersTable: Table;
}

const BACKEND_ROOT = path.join(__dirname, "..", "..", "backend");
const BACKEND_SRC = path.join(BACKEND_ROOT, "src");

/**
 * Cognito User Pool configured for mobile-number + OTP ("passwordless")
 * authentication via a custom-auth Lambda trigger chain, plus two groups
 * (CUSTOMERS, ADMINS) used for backend authorization. See spec sections 8-10.
 *
 * IMPORTANT MANUAL STEP (documented in README): creating the very FIRST
 * admin user must be done once, after deployment, via the AWS CLI —
 * `aws cognito-idp admin-add-user-to-group ... --group-name ADMINS`.
 * This stack deliberately does not auto-assign the ADMIN role to anyone.
 */
export class AuthStack extends Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly customersGroup: cognito.CfnUserPoolGroup;
  public readonly adminsGroup: cognito.CfnUserPoolGroup;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    const { envConfig, usersTable } = props;
    const removalPolicy = envConfig.isProduction ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;

    const nodeJsFunctionDefaults: Partial<lambda.NodejsFunctionProps> = {
      runtime: Runtime.NODEJS_22_X,
      projectRoot: BACKEND_ROOT,
      depsLockFilePath: path.join(BACKEND_ROOT, "package-lock.json"),
      bundling: {
        externalModules: ["@aws-sdk/*"],
        tsconfig: path.join(BACKEND_ROOT, "tsconfig.json"),
      },
      environment: {
        USER_TABLE_NAME: usersTable.tableName,
      },
      timeout: Duration.seconds(10),
    };

    const defineAuthChallengeFn = new lambda.NodejsFunction(this, "DefineAuthChallengeFn", {
      ...nodeJsFunctionDefaults,
      entry: path.join(BACKEND_SRC, "functions", "auth", "define-auth-challenge.ts"),
    });

    const createAuthChallengeFn = new lambda.NodejsFunction(this, "CreateAuthChallengeFn", {
      ...nodeJsFunctionDefaults,
      entry: path.join(BACKEND_SRC, "functions", "auth", "create-auth-challenge.ts"),
    });
    createAuthChallengeFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["sns:Publish"],
        resources: ["*"], // SNS Publish for SMS does not support resource-level ARNs.
      })
    );

    const verifyAuthChallengeFn = new lambda.NodejsFunction(this, "VerifyAuthChallengeFn", {
      ...nodeJsFunctionDefaults,
      entry: path.join(BACKEND_SRC, "functions", "auth", "verify-auth-challenge.ts"),
    });

    const preSignUpFn = new lambda.NodejsFunction(this, "PreSignUpFn", {
      ...nodeJsFunctionDefaults,
      entry: path.join(BACKEND_SRC, "functions", "auth", "pre-signup.ts"),
    });

    const postConfirmationFn = new lambda.NodejsFunction(this, "PostConfirmationFn", {
      ...nodeJsFunctionDefaults,
      entry: path.join(BACKEND_SRC, "functions", "auth", "post-confirmation.ts"),
    });
    usersTable.grantWriteData(postConfirmationFn);

    this.userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: `sangameshwara-${envConfig.envName}-users`,
      selfSignUpEnabled: true,
      signInAliases: { phone: true },
      autoVerify: { phone: true },
      standardAttributes: {
        phoneNumber: { required: true, mutable: true },
        fullname: { required: false, mutable: true },
      },
      passwordPolicy: {
        // Passwords are never used by customers (OTP-only), but Cognito
        // requires a password policy to exist; admins likewise authenticate
        // through the same OTP flow, not a password.
        minLength: 12,
      },
      accountRecovery: cognito.AccountRecovery.NONE,
      removalPolicy,
      lambdaTriggers: {
        defineAuthChallenge: defineAuthChallengeFn,
        createAuthChallenge: createAuthChallengeFn,
        verifyAuthChallengeResponse: verifyAuthChallengeFn,
        preSignUp: preSignUpFn,
        postConfirmation: postConfirmationFn,
      },
    });

    this.userPoolClient = this.userPool.addClient("WebClient", {
      userPoolClientName: `sangameshwara-${envConfig.envName}-web`,
      authFlows: {
        custom: true,
        userSrp: false,
      },
      preventUserExistenceErrors: true,
      accessTokenValidity: Duration.hours(1),
      idTokenValidity: Duration.hours(1),
      refreshTokenValidity: Duration.days(30),
    });

    this.customersGroup = new cognito.CfnUserPoolGroup(this, "CustomersGroup", {
      userPoolId: this.userPool.userPoolId,
      groupName: "CUSTOMERS",
      description: "Regular grocery-store customers.",
    });

    this.adminsGroup = new cognito.CfnUserPoolGroup(this, "AdminsGroup", {
      userPoolId: this.userPool.userPoolId,
      groupName: "ADMINS",
      description: "Store administrators with access to /admin.",
    });
  }
}
