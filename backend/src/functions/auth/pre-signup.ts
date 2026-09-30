import type { PreSignUpTriggerHandler } from "aws-lambda";

/**
 * Cognito trigger: PreSignUp
 *
 * Auto-confirms and auto-verifies the phone number for customers signing up
 * through the mobile-number + OTP flow, since successfully completing the
 * custom-auth OTP challenge IS the verification. This removes the need for
 * a separate "confirm sign up" step.
 */
export const handler: PreSignUpTriggerHandler = async (event) => {
  event.response.autoConfirmUser = true;
  event.response.autoVerifyPhone = true;
  return event;
};
