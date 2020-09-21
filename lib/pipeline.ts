import * as cdk from "@aws-cdk/core"
import * as cfn from "@aws-cdk/aws-cloudformation";
import * as codebuild from "@aws-cdk/aws-codebuild";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import * as ecr from "@aws-cdk/aws-ecr";
import * as pipelines from "@aws-cdk/pipelines";


export class PipelineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props) 

        const ecrRepo = new ecr.Repository(this, 'EcrRepo', { });

        // Replace the line above with these lines to keep your existing ECR Repository:
        // const ecrRepo = new ecr.Repository(this, 'EcrRepo', { repositoryName: 'cdk-journey' });
        // const cfnRepo = ecrRepo.node.defaultChild as ecr.CfnRepository;
        // cfnRepo.overrideLogicalId('Repository')

        const sourceArtifact = new codepipeline.Artifact();
        const cloudAssemblyArtifact = new codepipeline.Artifact();
        const buildArtifact = new codepipeline.Artifact();

        const pipeline = new pipelines.CdkPipeline(this, 'Pipeline', {
            cloudAssemblyArtifact,

            sourceAction: new codepipeline_actions.GitHubSourceAction({
                actionName: 'GitHub',
                output: sourceArtifact,
                oauthToken: cdk.SecretValue.secretsManager('GitHubToken'),
                owner: 'pgarbe',
                repo: 'cdk-journey',
                branch: 'step1'
            }),

            synthAction: pipelines.SimpleSynthAction.standardNpmSynth({
                environment: { buildImage: codebuild.LinuxBuildImage.STANDARD_4_0 },
                sourceArtifact: sourceArtifact,
                cloudAssemblyArtifact,
                buildCommand: 'npm run build',
            }),
        });

        const buildSpecBuild = new codebuild.PipelineProject(this, 'buildSpecBuild', {
            buildSpec: codebuild.BuildSpec.fromSourceFilename('./infra/buildspec.yaml'),
            environment: {
                privileged: true,
                buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2,
                environmentVariables: {
                    IMAGE_REPO_NAME: { value: ecrRepo.repositoryName },
                    AWS_ACCOUNT_ID: { value: cdk.Stack.of(this).account }
                },
            },
        });
        ecrRepo.grantPullPush(buildSpecBuild);

        const buildStage = pipeline.addStage('BuildApp');
        buildStage.addActions(new codepipeline_actions.CodeBuildAction({
            actionName: 'BuildApp',
            input: sourceArtifact,
            project: buildSpecBuild,
            outputs: [buildArtifact]
        }));

        const deployStage = pipeline.addStage('DeployApp');
        deployStage.addActions(new codepipeline_actions.CloudFormationCreateUpdateStackAction({
            actionName: 'DeployApp',
            templatePath: buildArtifact.atPath('cf-template.yaml'),
            templateConfiguration: buildArtifact.atPath('cf-template.config'),
            stackName: 'cdk-journey',
            adminPermissions: true,
            capabilities: [cfn.CloudFormationCapabilities.NAMED_IAM],
            parameterOverrides: {
                Repository: ecrRepo.repositoryArn,
                Tag: buildArtifact.getParam('parameters.json', 'Tag'),
            },            
        }))

    }
}
