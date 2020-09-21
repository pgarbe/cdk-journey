import * as cdk from "@aws-cdk/core"
import * as codebuild from "@aws-cdk/aws-codebuild";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import * as pipelines from "@aws-cdk/pipelines";


export class PipelineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props) 

        const sourceArtifact = new codepipeline.Artifact();
        const cloudAssemblyArtifact = new codepipeline.Artifact();

        const pipeline = new pipelines.CdkPipeline(this, 'Pipeline', {
            cloudAssemblyArtifact,

            sourceAction: new codepipeline_actions.GitHubSourceAction({
                actionName: 'GitHub',
                output: sourceArtifact,
                oauthToken: cdk.SecretValue.secretsManager('GitHubToken'),
                // Replace these with your actual GitHub project name
                owner: 'pgarbe',
                repo: 'cdk-journey',
            }),

            synthAction: pipelines.SimpleSynthAction.standardNpmSynth({
                environment: { buildImage: codebuild.LinuxBuildImage.STANDARD_4_0 },
                sourceArtifact: sourceArtifact,
                cloudAssemblyArtifact,
                buildCommand: 'npm run build',
            }),
        });


    }
}
