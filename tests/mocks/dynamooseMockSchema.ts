import dynamoose from 'dynamoose';

export const ItemMockSchema = new dynamoose.Schema(
  {
    pk: { type: String, hashKey: true },
    sk: { type: String, rangeKey: true },
  },
  { saveUnknown: true }
);
