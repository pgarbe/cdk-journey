import { beASupersetOfTemplate, deepObjectLike, expect as expectCDK, haveResource, haveResourceLike, matchTemplate } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Infrastructure from '../lib/infrastructure';

test('Keeps Route53 resource untouched', () => {
    const app = new cdk.App();

    // WHEN
    const stack = new Infrastructure.InfrastructureStack(app, 'MyTestStack');

    // THEN
    expectCDK(stack).to(matchTemplate({
        Resources: {
            LoadBalancerRecordSet: {
                Type: "AWS::Route53::RecordSet",
                Properties: {
                    Name: "cdk-journey.aws.garbe.io",
                }
            }
        }
    })); 
});
