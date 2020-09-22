#!/usr/bin/env node
import {App} from "@aws-cdk/core";
import { InfrastructureStack } from "../lib/infrastructure";
import { PipelineStack } from '../lib/pipeline';

const app = new App();
new PipelineStack(app, 'cdk-journey-pipeline-cdk', {   env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT || '424144556073', 
    region: process.env.CDK_DEFAULT_REGION || 'eu-west-1'
}});

// Enable ot run a local `cdk diff`
// new InfrastructureStack(app, 'cdk-journey', { stackName: 'cdk-journey'});