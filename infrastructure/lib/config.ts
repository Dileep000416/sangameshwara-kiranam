export interface EnvironmentConfig {
  /** "dev" or "prod" */
  envName: "dev" | "prod";
  isProduction: boolean;
  awsAccount: string;
  awsRegion: string;
  /** Admin WhatsApp number in E.164 format, e.g. "+919502003898" */
  adminWhatsappNumber: string;
  /** Optional custom domain for the frontend (leave undefined to use the default CloudFront domain). */
  domainName?: string;
  /** Existing ACM certificate ARN (us-east-1) for the custom domain, if any. */
  certificateArn?: string;
  corsAllowedOrigin: string;
}

/**
 * Reads deployment configuration from CDK context / environment variables.
 * Nothing here is a secret — see infrastructure/.env.example and the README
 * for how to supply these values at `cdk deploy` time, e.g.:
 *
 *   cdk deploy --all -c envName=dev -c adminWhatsappNumber=+919502003898
 */
export function getEnvironmentConfig(app: {
  node: { tryGetContext(key: string): unknown };
}): EnvironmentConfig {
  const envName = (app.node.tryGetContext("envName") as string) || process.env.ENV_NAME || "dev";
  if (envName !== "dev" && envName !== "prod") {
    throw new Error(`envName must be "dev" or "prod", got "${envName}"`);
  }

  const awsAccount =
    (app.node.tryGetContext("awsAccount") as string) || process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID || "";
  const awsRegion =
    (app.node.tryGetContext("awsRegion") as string) || process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || "ap-south-1";

  const adminWhatsappNumber =
    (app.node.tryGetContext("adminWhatsappNumber") as string) || process.env.ADMIN_WHATSAPP_NUMBER || "";

  const domainName = (app.node.tryGetContext("domainName") as string) || process.env.DOMAIN_NAME || undefined;
  const certificateArn = (app.node.tryGetContext("certificateArn") as string) || process.env.CERTIFICATE_ARN || undefined;

  const corsAllowedOrigin =
    (app.node.tryGetContext("corsAllowedOrigin") as string) || process.env.CORS_ALLOWED_ORIGIN || "*";

  return {
    envName,
    isProduction: envName === "prod",
    awsAccount,
    awsRegion,
    adminWhatsappNumber,
    domainName,
    certificateArn,
    corsAllowedOrigin,
  };
}
