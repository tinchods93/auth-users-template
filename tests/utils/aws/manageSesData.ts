//Create tables in dynamoDb. just for testing.
const AWS = require('aws-sdk');
const AWSXRay = require('aws-xray-sdk');

const endpoint = new AWS.Endpoint('http://localhost:4566');
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'fake-access-key',
  secretAccessKey: 'fake-secret-key',
  endpoint,
});

AWSXRay.setContextMissingStrategy('LOG_ERROR');
const ses = new AWS.SES();

const verifyEmail = async (email) => {
  const response = await ses
    .verifyEmailAddress({ EmailAddress: email })
    .promise();
  return response;
};

export { verifyEmail };
