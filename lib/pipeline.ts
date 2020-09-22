import * as cdk from "@aws-cdk/core"
import * as codebuild from "@aws-cdk/aws-codebuild";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import * as pipelines from "@aws-cdk/pipelines";
import { InfrastructureStack } from "./infrastructure";

class CdkJourneyApplication extends cdk.Stage {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        new InfrastructureStack(this, 'cdk-journey', { 
            stackName: 'cdk-journey',
        });
    }
}

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
                owner: 'pgarbe',
                repo: 'cdk-journey',
                branch: 'step3'
            }),

            synthAction: pipelines.SimpleSynthAction.standardNpmSynth({
                environment: { 
                    buildImage: codebuild.LinuxBuildImage.STANDARD_4_0,
                },
                sourceArtifact: sourceArtifact,
                cloudAssemblyArtifact,
                buildCommand: 'npm run build && npm run test',
            }),
        });

        pipeline.addApplicationStage(new CdkJourneyApplication(this, 'Prod', {
            env: { 
                account: '424144556073', // cdk.Stack.of(scope).account, 
                region: 'eu-west-1', // cdk.Stack.of(scope).region
            }
        }));
    }
}
