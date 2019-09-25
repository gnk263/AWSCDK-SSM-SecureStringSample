#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { AwscdkSsmSecureStringSampleStack } from '../lib/awscdk-ssm-secure_string_sample-stack';

const app = new cdk.App();
new AwscdkSsmSecureStringSampleStack(app, 'AwscdkSsmSecureStringSampleStack');
