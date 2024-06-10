import { Schema } from 'dynamoose/dist/Schema';

export interface BasicEntityInterface {
  getTableSchema(): Schema;
}
