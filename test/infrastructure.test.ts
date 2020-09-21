import { beASupersetOfTemplate, expect as expectCDK, haveResource, haveResourceLike, MatchStyle, matchTemplate } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Infrastructure from '../lib/infrastructure';

test('Keeps Route53 resource untouched', () => {

    // WHEN
    const app = new cdk.App();
    const stack = new Infrastructure.InfrastructureStack(app, 'MyTestStack');

    expectCDK(stack).to(haveResourceLike('AWS::Route53::RecordSet', {
        "Name": "cdk-journey.aws.garbe.io",
        "Type": "A",
        "AliasTarget": {
            "DNSName": {
                "Fn::GetAtt": [
                    "ElasticLoadBalancer",
                    "DNSName"
                ]
            },
            "HostedZoneId": {
                "Fn::GetAtt": [
                    "ElasticLoadBalancer",
                    "CanonicalHostedZoneID"
                ]
            }
        },
        "Comment": "A records for service",
        "HostedZoneId": {
            "Fn::ImportValue": "zone-HostedZoneId"
        }
    }));

    // expectCDK(stack).to(beASupersetOfTemplate({
    //     "LoadBalancerRecordSet": {
    //         "Type": "AWS::Route53::RecordSet",
    //         "Properties": {
    //             "Name": "cdk-journey.aws.garbe.io",
    //             "Type": "A",
    //             "AliasTarget": {
    //                 "DNSName": {
    //                     "Fn::GetAtt": [
    //                         "ElasticLoadBalancer",
    //                         "DNSName"
    //                     ]
    //                 },
    //                 "HostedZoneId": {
    //                     "Fn::GetAtt": [
    //                         "ElasticLoadBalancer",
    //                         "CanonicalHostedZoneID"
    //                     ]
    //                 }
    //             },
    //             "Comment": "A records for service",
    //             "HostedZoneId": {
    //                 "Fn::ImportValue": "zone-HostedZoneId"
    //             }
    //         }
    //     }
    // }
    // ));
});
