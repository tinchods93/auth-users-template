import { ConditionInitializer } from 'dynamoose/dist/Condition';

export type TableKeyType = { pk: string; sk: string };

export type CreateTableItemMethodInput = TableKeyType & {
  [key: string]: any;
};

export type QueryTableItemMethodInput = {
  query: ConditionInitializer;
  options?: {
    using_index?: string;
  };
};

export type UpdateTableItemMethodInput = {
  key: TableKeyType;
  payload: any;
};
