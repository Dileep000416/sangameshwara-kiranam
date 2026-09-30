import type { DefineAuthChallengeTriggerHandler } from "aws-lambda";

/**
 * Cognito custom-auth trigger: DefineAuthChallenge
 *
 * Drives the mobile-number + OTP login flow:
 *   1. First attempt -> issue a CUSTOM_CHALLENGE (the OTP).
 *   2. If the customer answers correctly -> issue tokens.
 *   3. If they answer incorrectly 3 times, or answer correctly, stop.
 */
export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  const session = event.request.session ?? [];

  if (session.length === 0) {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
    return event;
  }

  const lastAttempt = session[session.length - 1];

  if (
    lastAttempt?.challengeName === "CUSTOM_CHALLENGE" &&
    lastAttempt.challengeResult === true
  ) {
    event.response.issueTokens = true;
    event.response.failAuthentication = false;
    return event;
  }

  if (session.length >= 3) {
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
    return event;
  }

  event.response.issueTokens = false;
  event.response.failAuthentication = false;
  event.response.challengeName = "CUSTOM_CHALLENGE";
  return event;
};
