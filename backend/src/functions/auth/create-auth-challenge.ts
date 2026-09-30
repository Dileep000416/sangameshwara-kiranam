import type { CreateAuthChallengeTriggerHandler } from "aws-lambda";
import { randomInt } from "crypto";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({});
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Cognito custom-auth trigger: CreateAuthChallenge
 *
 * Generates a 6-digit OTP, sends it to the user's phone number via Amazon
 * SNS SMS, and stashes the OTP + expiry in the (server-side only)
 * privateChallengeParameters so VerifyAuthChallengeResponse can check it.
 * The OTP is never included in publicChallengeParameters, so it never
 * reaches the client.
 */
export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  if (event.request.challengeName !== "CUSTOM_CHALLENGE") {
    return event;
  }

  // DefineAuthChallenge only asks for a fresh CUSTOM_CHALLENGE when the
  // previous attempt (if any) failed and the retry limit hasn't been
  // reached, so generating and sending a brand-new OTP on every invocation
  // here is the correct, standard behavior (each retry gets a fresh code).
  const otp = randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + OTP_TTL_MS;
  const phoneNumber = event.request.userAttributes.phone_number;

  if (phoneNumber) {
    await sns.send(
      new PublishCommand({
        PhoneNumber: phoneNumber,
        Message: `Your Sangameshwara Kiranam verification code is ${otp}. It expires in 5 minutes.`,
        MessageAttributes: {
          "AWS.SNS.SMS.SMSType": {
            DataType: "String",
            StringValue: "Transactional",
          },
        },
      })
    );
  }

  event.response.publicChallengeParameters = { phone: phoneNumber ?? "" };
  event.response.privateChallengeParameters = {
    answer: otp,
    expiresAt: String(expiresAt),
  };
  event.response.challengeMetadata = `OTP-${expiresAt}`;

  return event;
};
