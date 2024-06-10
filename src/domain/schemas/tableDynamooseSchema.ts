import dynamoose from 'dynamoose';
import { TableGsiEnum } from '../enums/userTableGsi';

export const TableItemDynamooseSchema = new dynamoose.Schema(
  {
    pk: { type: String, hashKey: true },
    sk: {
      type: String,
      rangeKey: true,
    },
    type: {
      type: String,
      index: {
        name: TableGsiEnum.TYPE,
        type: 'global',
      },
    },
  },
  { saveUnknown: true }
);
