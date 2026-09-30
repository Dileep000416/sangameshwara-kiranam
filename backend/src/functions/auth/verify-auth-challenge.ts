import type { VerifyAuthChallengeResponseTriggerHandler } from "aws-lambda";

/**
 * Cognito custom-auth trigger: VerifyAuthChallengeResponse
 *
 * Compares the OTP the user submitted against the one generated in
 * CreateAuthChallenge, enforcing the 5-minute expiry window.
 */
export const handler: VerifyAuthChallengeResponseTriggerHandler = async (event) => {
  const expectedAnswer = event.request.privateChallengeParameters.answer;
  const expiresAt = Number(event.request.privateChallengeParameters.expiresAt ?? 0);
  const submittedAnswer = event.request.challengeAnswer;

  const isCorrect = Boolean(expectedAnswer) && submittedAnswer === expectedAnswer;
  const isExpired = Date.now() > expiresAt;

  event.response.answerCorrect = isCorrect && !isExpired;

  return event;
};
