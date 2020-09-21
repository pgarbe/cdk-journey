import * as cdk from '@aws-cdk/core';
import * as cfn_inc from '@aws-cdk/cloudformation-include';
import { env } from 'process';

interface InfrastructureStackProps extends cdk.StackProps {
    readonly repositoryUri: string
}

export class InfrastructureStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: InfrastructureStackProps) {
        super(scope, id, props);

        const stack = new cfn_inc.CfnInclude(this, 'Template', {
            templateFile: './infra/cf-template.yaml',
        });

        // Overwrite resources of the template. See also https://docs.aws.amazon.com/cdk/api/latest/docs/cloudformation-include-readme.html
        stack.getParameter("DesiredCount").default = '1'; // from cf-template.config
        stack.getParameter("Repository").default = props?.repositoryUri // from PipelineStack
        stack.getParameter("Tag").default = env['CODEBUILD_RESOLVED_SOURCE_VERSION']
    }
}