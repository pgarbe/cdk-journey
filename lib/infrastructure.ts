import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import * as route53 from '@aws-cdk/aws-route53';
import * as alias from  '@aws-cdk/aws-route53-targets';
import { CfnRecordSet } from '@aws-cdk/aws-route53';

export class InfrastructureStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = WiddixTemplates.get2AzVpc(this);

        const taskDefinition = new ecs.TaskDefinition(this, 'TaskDef', {
            cpu: '1024',
            memoryMiB: '2048',
            compatibility: ecs.Compatibility.FARGATE
        });
        const container = taskDefinition.addContainer('cdk-journey', {
            healthCheck: {
                command: [
                    'CMD-SHELL',
                    'curl --fail --insecure https://localhost/'
                ],
                interval: cdk.Duration.seconds(5),
                retries: 2,
                startPeriod: cdk.Duration.seconds(100),
                timeout: cdk.Duration.seconds(2),
            },
            image: ecs.ContainerImage.fromAsset('./src')
        });
        container.addPortMappings({ containerPort: 80});

        const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'cdk-journey', {
            vpc,
            taskDefinition
        });

        // const recordSet = new route53.RecordSet(this, 'recordSet', {
        const hostedZone = WiddixTemplates.getHostedZone(this);

        const recordSet = new route53.ARecord(this, 'AliasRecord', {
            zone: hostedZone,
            recordName: 'cdk-journey',
            target: route53.RecordTarget.fromAlias(new alias.LoadBalancerTarget(fargateService.loadBalancer)),
        });

        // Keep the logical Id
        (recordSet.node.defaultChild as CfnRecordSet).overrideLogicalId('LoadBalancerRecordSet');
    }
}

export class WiddixTemplates {

    public static getHostedZone(scope: cdk.Construct): route53.IHostedZone {

        return route53.HostedZone.fromHostedZoneAttributes(scope, 'HostedZone', 
        {
            hostedZoneId: cdk.Fn.importValue('zone-HostedZoneId'),
            zoneName: cdk.Fn.importValue('zone-HostedZoneId'),
        });
    }

    // See https://templates.cloudonaut.io/en/stable/vpc/
    public static get2AzVpc(scope: cdk.Construct): ec2.IVpc {
        return ec2.Vpc.fromVpcAttributes(scope, 'WiddixVpc', {
            vpcId: cdk.Fn.importValue('vpc-VPC'),
            availabilityZones: [
                cdk.Fn.importValue('vpc-AZA'),
                cdk.Fn.importValue('vpc-AZB')
            ],
            privateSubnetRouteTableIds: [
                cdk.Fn.importValue('RouteTableAPrivate'),
                cdk.Fn.importValue('RouteTableBPrivate')
            ],
            publicSubnetRouteTableIds: [
                cdk.Fn.importValue('RouteTableAPublic'),
                cdk.Fn.importValue('RouteTableBPublic')
            ],
            privateSubnetIds: [
                cdk.Fn.importValue('vpc-SubnetAPrivate'),
                cdk.Fn.importValue('vpc-SubnetBPrivate'),
            ],
            publicSubnetIds: [
                cdk.Fn.importValue('vpc-SubnetAPublic'),
                cdk.Fn.importValue('vpc-SubnetBPublic'),
            ],
        });
    }
}