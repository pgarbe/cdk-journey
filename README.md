# The journey of a CloudFormation template into CDK

This source code is used as example in my talks.

## Prerequisits
Have VPC stack installed (see https://templates.cloudonaut.io/en/stable/vpc/)
Have Public Zone stack installed (https://templates.cloudonaut.io/en/stable/vpc/#public-dns-zone)

Deploy the initial pipeline:

```bash
aws cloudformation deploy --stack-name cdk-journey-pipeline --template-file infra/pipeline.yaml --capabilities CAPABILITY_IAM
```

## From CloudFormation to CDK

### Step 1: Migrate the pipeline template
```bash
git checkout step1
cdk bootstrap --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess 
```

### Step 2: Include infrastructure template
```bash
git checkout step2
```

### Step 3: Turn into native CDK app
```bash
git checkout step3
```

### Step 4: Take advantage of CDK
```bash
git checkout step4
```
