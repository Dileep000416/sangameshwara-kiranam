import { RemovalPolicy, Stack, type StackProps } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";
import type { EnvironmentConfig } from "./config";

export interface StorageStackProps extends StackProps {
  envConfig: EnvironmentConfig;
}

/**
 * S3 buckets:
 *  - productImagesBucket: stores product/category images uploaded by the
 *    admin via presigned PUT URLs (see backend admin/upload-url.ts). Publicly
 *    readable objects only (no bucket listing) so product images can be
 *    rendered directly by <img> tags without going through CloudFront/Lambda.
 *
 * Note: the frontend hosting bucket lives in frontend-stack.ts, not here.
 * CloudFront's Origin Access Control mechanism adds a bucket policy
 * statement that references the distribution, which would otherwise create
 * a dependency cycle between this stack and the frontend stack — keeping
 * the hosting bucket and its distribution together avoids that.
 */
export class StorageStack extends Stack {
  public readonly productImagesBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: StorageStackProps) {
    super(scope, id, props);

    const { envConfig } = props;
    const removalPolicy = envConfig.isProduction ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;

    this.productImagesBucket = new s3.Bucket(this, "ProductImagesBucket", {
      bucketName: `sangameshwara-${envConfig.envName}-product-images-${this.account}`,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        ignorePublicAcls: true,
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
      }),
      cors: [
        {
          allowedMethods: [s3.HttpMethods.PUT, s3.HttpMethods.GET],
          allowedOrigins: [envConfig.corsAllowedOrigin],
          allowedHeaders: ["*"],
          maxAge: 3000,
        },
      ],
      removalPolicy,
      autoDeleteObjects: !envConfig.isProduction,
    });

    // Allow public read of product images only (no ListBucket), so
    // <img src="https://bucket.s3.region.amazonaws.com/products/xyz.jpg">
    // works directly without exposing the bucket contents.
    this.productImagesBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.AnyPrincipal()],
        actions: ["s3:GetObject"],
        resources: [
          this.productImagesBucket.arnForObjects("products/*"),
          this.productImagesBucket.arnForObjects("categories/*"),
        ],
      })
    );
  }
}
