//Create tables in dynamoDb. just for testing.
const AWS = require('aws-sdk');
const AWSXRay = require('aws-xray-sdk');

const endpoint = new AWS.Endpoint(process.env.LOCALHOST);
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'fake-access-key',
  secretAccessKey: 'fake-secret-key',
  endpoint,
});

AWSXRay.setContextMissingStrategy('LOG_ERROR');
const dynamoDb = new AWS.DynamoDB();

const createTable = async (input: any) => {
  const {
    tableName,
    hashKeyName = 'id',
    hashKeyType = 'HASH',
    hashAttributeType = 'S',
    sortKeyName,
    sortKeyType = 'RANGE',
    sortAttributeType,
    globalSecondaryIndexes = [],
    attributeDefinitions = [],
  } = input;

  const dynamoDb = new AWS.DynamoDB();

  const KeySchema = [
    { AttributeName: hashKeyName, KeyType: hashKeyType }, //Partition key
  ];
  const AttributeDefinitions = [
    { AttributeName: hashKeyName, AttributeType: hashAttributeType },
  ];

  if (sortKeyName) {
    KeySchema.push({
      AttributeName: sortKeyName,
      KeyType: sortKeyType,
    });
    AttributeDefinitions.push({
      AttributeName: sortKeyName,
      AttributeType: sortAttributeType,
    });
  }

  const params: any = {
    TableName: tableName,
    KeySchema,
    AttributeDefinitions,
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  if (globalSecondaryIndexes.length) {
    params.GlobalSecondaryIndexes = globalSecondaryIndexes;
  }

  if (attributeDefinitions.length) {
    params.AttributeDefinitions = attributeDefinitions;
  }

  await dynamoDb
    .createTable(params)
    .promise()
    .catch((error) => {
      console.log(error, '------->');
    });
};

const deleteTable = async (tableName) => {
  await dynamoDb
    .deleteTable({
      TableName: tableName,
    })
    .promise();
};

export { createTable, deleteTable };
