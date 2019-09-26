import * as AWS from 'aws-sdk';

const ssm = new AWS.SSM();


export async function handler(event: any) {
    const id = event.pathParameters.id;

    var ssmSecureParam1 = await ssm.getParameter({
        Name: '/CDK/Sample/SecureParam1',
        WithDecryption: true,
    }).promise();

    let secureParam1: string = 'Unkown';
    if (ssmSecureParam1.Parameter != null && ssmSecureParam1.Parameter.Value != null) {
        secureParam1 = ssmSecureParam1.Parameter.Value;
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            normal_param1: process.env.NORMAL_PARAM1,
            secure_param1: secureParam1,
            message: `request id: ${id}`,
        }),
    }
}
