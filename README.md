# The journey of a CloudFormation template into CDK

This source code is used as example in my talks.


# TODOs
[x] Create pipeline w/ cfn  
[x] Create Fargate app w/ cfn  
[ ] Step 1: Introduce CDK / Migrate pipeline
[ ] Step 2: cfn-include
[ ] Step 3: Make CDK native app
[ ] Step 4: Enhance it

## Prerequisits
Have VPC stack installed (see https://templates.cloudonaut.io/en/stable/vpc/)
Have Public Zone stack installed (https://templates.cloudonaut.io/en/stable/vpc/#public-dns-zone)


## From CloudFormation to CDK

### Step 1: Introduce CDK

Create a new cdk app in empty folder and copy it back.

```bash
 cdk init app --language=typescript
```

Add 