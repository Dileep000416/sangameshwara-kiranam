import type {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireAdmin } from "@common/auth";
import { ApiError, handleError, ok, parseBody } from "@common/http";
import { requireString } from "@common/validation";

const s3 = new S3Client({});

const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * POST /admin/products/upload-url
 * Body: { contentType }
 *
 * Returns a short-lived presigned S3 PUT URL so the admin browser can upload
 * a product image directly to S3 without the image ever passing through
 * Lambda, and without any long-lived AWS credentials reaching the frontend.
 */
export async function handler(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    requireAdmin(event);

    const bucket = process.env.PRODUCT_BUCKET_NAME;
    if (!bucket) {
      throw new Error("PRODUCT_BUCKET_NAME environment variable is not configured.");
    }

    const body = parseBody<{ contentType?: string }>(event);
    const contentType = requireString(body.contentType, "contentType");

    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      throw new ApiError(400, "contentType must be image/jpeg, image/png, or image/webp.");
    }

    const extension = EXTENSION_BY_TYPE[contentType];
    const key = `products/${randomUUID()}.${extension}`;

    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      }),
      { expiresIn: 300 }
    );

    const publicUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return ok({ uploadUrl, key, publicUrl, expiresInSeconds: 300 });
  } catch (err) {
    return handleError(err);
  }
}
