import type { PostConfirmationTriggerHandler } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TableNames } from "@common/dynamo";
import type { UserRecord } from "@common/types";

const cognito = new CognitoIdentityProviderClient({});

/**
 * Cognito trigger: PostConfirmation
 *
 * Runs once, right after a brand-new customer completes sign-up (i.e. their
 * very first successful OTP verification). Creates the corresponding
 * DynamoDB user profile (role = CUSTOMER) and adds them to the CUSTOMERS
 * Cognito group. The very first admin account is instead created manually
 * via the AWS CLI/Console per the README — this trigger never assigns the
 * ADMIN role automatically.
 */
export const handler: PostConfirmationTriggerHandler = async (event) => {
  if (event.triggerSource !== "PostConfirmation_ConfirmSignUp") {
    return event;
  }

  const userId: string = event.request.userAttributes.sub ?? event.userName;
  const phoneNumber: string = event.request.userAttributes.phone_number ?? "";
  const now = new Date().toISOString();

  const user: UserRecord = {
    userId,
    mobileNumber: phoneNumber,
    name: "Customer",
    role: "CUSTOMER",
    accountStatus: "ACTIVE",
    createdAt: now,
    updatedAt: now,
  };

  await ddb.send(new PutCommand({ TableName: TableNames.USERS, Item: user }));

  await cognito.send(
    new AdminAddUserToGroupCommand({
      UserPoolId: event.userPoolId,
      Username: event.userName,
      GroupName: "CUSTOMERS",
    })
  );

  return event;
};
