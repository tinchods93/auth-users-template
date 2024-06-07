import { ConditionInitializer } from 'dynamoose/dist/Condition';

export const TABLE_SERVICE_TOKEN = Symbol('TableServiceInterface');

export interface TableServiceInterface {
  create(data: {
    pk: string;
    sk: string;
    type: string;
    [key: string]: any;
  }): Promise<any>;
  query(params: {
    query: ConditionInitializer;
    options?: {
      using_index?: string;
    };
  }): Promise<any[] | undefined>;
}
