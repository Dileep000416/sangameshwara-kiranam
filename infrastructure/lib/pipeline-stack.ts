import { Stack, type StackProps } from "aws-cdk-lib";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as actions from "aws-cdk-lib/aws-codepipeline-actions";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as iam from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";
import type { EnvironmentConfig } from "./config";

export interface PipelineStackProps extends StackProps {
  envConfig: EnvironmentConfig;
  frontendBucket: s3.Bucket;
  distribution: cloudfront.Distribution;
  /**
   * ARN of an existing CodeStar Connections connection to GitHub.
   * MANUAL STEP: create this once in the AWS Console
   * (Developer Tools > Settings > Connections > Create connection > GitHub)
   * and authorize it, then pass its ARN here via CDK context/env.
   * See README "CI/CD Setup" for exact steps.
   */
  githubConnectionArn?: string;
  githubOwner?: string;
  githubRepo?: string;
  githubBranch?: string;
}

/**
 * CI/CD pipeline: on push to the configured branch, this pipeline
 *   1. Pulls source from GitHub (via CodeStar Connections).
 *   2. Builds + deploys the CDK infrastructure (backend/API/DB/etc).
 *   3. Builds the Next.js static export and syncs it to the frontend S3
 *      bucket, then invalidates CloudFront.
 *
 * This stack is only synthesized/deployed when a GitHub connection ARN is
 * supplied, since a connection must be manually created and authorized in
 * the AWS console first (CodeStar Connections cannot be fully automated).
 * Until then, deploy manually with `npm run deploy` from infrastructure/
 * and `next build && aws s3 sync` for the frontend — see README.
 */
export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const { envConfig, frontendBucket, distribution, githubConnectionArn, githubOwner, githubRepo, githubBranch } =
      props;

    if (!githubConnectionArn || !githubOwner || !githubRepo) {
      // Intentionally not throwing: allows `cdk synth` for the other stacks
      // to succeed even before the GitHub connection is set up.
      return;
    }

    const sourceOutput = new codepipeline.Artifact("Source");
    const infraBuildOutput = new codepipeline.Artifact("InfraBuild");
    const frontendBuildOutput = new codepipeline.Artifact("FrontendBuild");

    const sourceAction = new actions.CodeStarConnectionsSourceAction({
      actionName: "GitHub_Source",
      owner: githubOwner,
      repo: githubRepo,
      branch: githubBranch ?? "main",
      connectionArn: githubConnectionArn,
      output: sourceOutput,
      triggerOnPush: true,
    });

    const infraBuildProject = new codebuild.PipelineProject(this, "InfraBuildProject", {
      projectName: `sangameshwara-${envConfig.envName}-infra-build`,
      environment: { buildImage: codebuild.LinuxBuildImage.STANDARD_7_0 },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: { "runtime-versions": { nodejs: 20 }, commands: ["cd infrastructure", "npm ci"] },
          build: {
            commands: [
              `npx cdk deploy --all --require-approval never -c envName=${envConfig.envName} -c adminWhatsappNumber="$ADMIN_WHATSAPP_NUMBER"`,
            ],
          },
        },
      }),
    });
    infraBuildProject.role?.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ["*"],
        resources: ["*"],
        // CDK deployments need broad permissions to manage arbitrary
        // resources across stacks; scope this down with a permissions
        // boundary before using in a real production account.
      })
    );

    const infraBuildAction = new actions.CodeBuildAction({
      actionName: "Deploy_Infrastructure",
      project: infraBuildProject,
      input: sourceOutput,
      outputs: [infraBuildOutput],
    });

    const frontendBuildProject = new codebuild.PipelineProject(this, "FrontendBuildProject", {
      projectName: `sangameshwara-${envConfig.envName}-frontend-build`,
      environment: { buildImage: codebuild.LinuxBuildImage.STANDARD_7_0 },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: { "runtime-versions": { nodejs: 20 }, commands: ["cd frontend", "npm ci"] },
          build: { commands: ["npm run build"] },
          post_build: {
            commands: [
              `aws s3 sync ./out s3://${frontendBucket.bucketName} --delete`,
              `aws cloudfront create-invalidation --distribution-id ${distribution.distributionId} --paths "/*"`,
            ],
          },
        },
      }),
    });
    frontendBucket.grantReadWrite(frontendBuildProject);
    frontendBuildProject.role?.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ["cloudfront:CreateInvalidation"],
        resources: ["*"],
      })
    );

    const frontendBuildAction = new actions.CodeBuildAction({
      actionName: "Build_And_Deploy_Frontend",
      project: frontendBuildProject,
      input: sourceOutput,
      outputs: [frontendBuildOutput],
    });

    new codepipeline.Pipeline(this, "Pipeline", {
      pipelineName: `sangameshwara-${envConfig.envName}-pipeline`,
      stages: [
        { stageName: "Source", actions: [sourceAction] },
        { stageName: "DeployInfrastructure", actions: [infraBuildAction] },
        { stageName: "DeployFrontend", actions: [frontendBuildAction] },
      ],
    });
  }
}
