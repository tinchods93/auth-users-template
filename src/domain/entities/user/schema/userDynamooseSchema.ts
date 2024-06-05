import dynamoose from 'dynamoose';
import { UserTableGsiEnum } from '../../license/enum/userTableGsi';

export const UserEntityDynamooseSchema = new dynamoose.Schema(
  {
    pk: { type: String, hashKey: true },
    sk: {
      type: String,
      rangeKey: true,
    },
    type: {
      type: String,
      index: {
        name: UserTableGsiEnum.TYPE,
        type: 'global',
      },
    },
  },
  { saveUnknown: true }
);
