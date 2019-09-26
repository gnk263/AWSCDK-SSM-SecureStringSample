import * as apigateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ssm from '@aws-cdk/aws-ssm';
import * as iam from '@aws-cdk/aws-iam';
import { ServicePrincipal, ManagedPolicy } from '@aws-cdk/aws-iam';
import { Duration } from '@aws-cdk/core';
import cdk = require('@aws-cdk/core');

export class AwscdkSsmSecureStringSampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // SSM(String)
    const normalParam1 = ssm.StringParameter.fromStringParameterAttributes(this, 'NormalParam1', {
      parameterName: '/CDK/Sample/NormalParam1',
    });

    // SSM(SecureStriing)
    //   Lambdaは未サポート（RDSのMasterUserPasswordなど、一部のみ使用できる）なので、
    //   ここでは何もしない（Lambdaコード中で取得する）

    // IAMロール(Lambda用)
    const iamRoleForLambda = new iam.Role(this, 'IAMRoleForSampleLamda', {
      roleName: 'ssm-secure-string-sample-role',
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMReadOnlyAccess'),
      ]
    });

    // Lambda
    const sampleLambda = new lambda.Function(this, 'SampleLambda', {
      code: lambda.Code.asset('src/lambda'),
      handler: 'app.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      functionName: 'ssm-secure-string-sample-function',
      timeout: Duration.seconds(3),
      role: iamRoleForLambda,
      environment: {
        NORMAL_PARAM1: normalParam1.stringValue,
      }
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'SampleApi', {
      restApiName: 'ssm-secure-string-sample-api',
    });

    const integration = new apigateway.LambdaIntegration(sampleLambda, {
      proxy: true,
    });

    const resource = api.root.addResource('{id}');
    resource.addMethod('GET', integration);
  }
}
