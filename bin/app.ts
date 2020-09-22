#!/usr/bin/env node
import {App} from "@aws-cdk/core";
import { InfrastructureStack } from "../lib/infrastructure";
import { PipelineStack } from '../lib/pipeline';

const app = new App();
new PipelineStack(app, 'cdk-journey-pipeline-cdk', { 
    env: { 
        account: '424144556073', // cdk.Stack.of(scope).account, 
        region: 'eu-west-1', // cdk.Stack.of(scope).region
    }

});

// Enable ot run a local `cdk diff`
// new InfrastructureStack(app, 'cdk-journey', { stackName: 'cdk-journey'});