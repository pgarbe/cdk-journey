import { beASupersetOfTemplate, expect as expectCDK, MatchStyle, matchTemplate } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Infrastructure from '../lib/infrastructure';

test('Keeps Route53 resource untouched', () => {

    // WHEN
    const app = new cdk.App();
    const stack = new Infrastructure.InfrastructureStack(app, 'MyTestStack', { repositoryUri: ''});

    // THEN
    expectCDK(stack).to(matchTemplate({
        "LoadBalancerRecordSet": {
            "Type": "AWS::Route53::RecordSet",
            "Properties": {
                "Name": "cdk-journeyXXX.aws.garbe.io",
            }
        }
    }, MatchStyle.NO_REPLACES)); 
});
