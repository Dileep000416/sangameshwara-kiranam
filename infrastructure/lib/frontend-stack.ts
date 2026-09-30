import { Duration, RemovalPolicy, Stack, type StackProps, CfnOutput } from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as s3 from "aws-cdk-lib/aws-s3";
import type { Construct } from "constructs";
import type { EnvironmentConfig } from "./config";

export interface FrontendStackProps extends StackProps {
  envConfig: EnvironmentConfig;
}

/**
 * CloudFront distribution serving the Next.js static export from
 * frontendBucket via Origin Access Control (no public bucket access needed).
 *
 * SPA-routing note: `next build` with `output: "export"` (+ `trailingSlash: true`
 * in next.config.ts) emits a real HTML file per route as `<route>/index.html`
 * (e.g. /cart/index.html, /admin/products/index.html) rather than a single
 * index.html + client router.
 *
 * Unlike an S3 *website-hosting* endpoint, the S3 REST endpoint used with
 * Origin Access Control does NOT automatically append "index.html" to a
 * directory-style request (e.g. a request for "/products/" is looked up as
 * the literal object key "products/", which doesn't exist, producing a 403
 * from S3 that CloudFront maps to our 404 error page). A small CloudFront
 * Function rewrites the request URI at the edge — for free, with no Lambda
 * cold starts — before it ever reaches the S3 origin, so every route
 * (including a hard refresh or direct link) resolves correctly.
 */
export class FrontendStack extends Stack {
  public readonly distribution: cloudfront.Distribution;
  public readonly frontendBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    const { envConfig } = props;
    const removalPolicy = envConfig.isProduction ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;

    this.frontendBucket = new s3.Bucket(this, "FrontendBucket", {
      bucketName: `sangameshwara-${envConfig.envName}-frontend-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy,
      autoDeleteObjects: !envConfig.isProduction,
    });

    let certificate: acm.ICertificate | undefined;
    if (envConfig.domainName && envConfig.certificateArn) {
      certificate = acm.Certificate.fromCertificateArn(this, "Certificate", envConfig.certificateArn);
    }

    const indexRewriteFunction = new cloudfront.Function(this, "IndexRewriteFunction", {
      functionName: `sangameshwara-${envConfig.envName}-index-rewrite`,
      code: cloudfront.FunctionCode.fromInline(`
        function handler(event) {
          var request = event.request;
          var uri = request.uri;

          // "/" -> "/index.html"; "/products/" or "/products" -> "/products/index.html"
          if (uri.endsWith("/")) {
            request.uri = uri + "index.html";
          } else if (!uri.includes(".")) {
            request.uri = uri + "/index.html";
          }

          return request;
        }
      `),
      runtime: cloudfront.FunctionRuntime.JS_2_0,
    });

    this.distribution = new cloudfront.Distribution(this, "Distribution", {
      comment: `Sangameshwara Kiranam frontend (${envConfig.envName})`,
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.frontendBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
        functionAssociations: [
          {
            function: indexRewriteFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: "/404.html",
          ttl: Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: "/404.html",
          ttl: Duration.minutes(5),
        },
      ],
      domainNames: envConfig.domainName ? [envConfig.domainName] : undefined,
      certificate,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    new CfnOutput(this, "DistributionDomainName", {
      value: this.distribution.distributionDomainName,
      description: "Default CloudFront domain. Point your custom domain's CNAME/ALIAS here, or use it directly.",
    });

    new CfnOutput(this, "FrontendBucketName", {
      value: this.frontendBucket.bucketName,
      description: "Deploy the Next.js static export (frontend/out) to this bucket, then invalidate the CloudFront distribution.",
    });
  }
}
