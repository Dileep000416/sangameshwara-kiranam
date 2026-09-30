// Central place to read NEXT_PUBLIC_* environment variables. Values are
// inlined at build time by Next.js, so this file exists purely for a single
// typed access point rather than scattering `process.env.NEXT_PUBLIC_*`
// across the codebase.

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  cognitoUserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? "",
  cognitoClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? "",
  awsRegion: process.env.NEXT_PUBLIC_AWS_REGION ?? "ap-south-1",
  storeWhatsappNumber: process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER ?? "",
};
