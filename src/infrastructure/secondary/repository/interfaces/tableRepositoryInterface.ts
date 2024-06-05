import { Schema, SchemaDefinition } from 'dynamoose/dist/Schema';
import { TableServiceInterface } from '../../services/interface/tableServiceInterface';

export const TABLE_REPOSITORY_TOKEN = Symbol('TableRepositoryInterface');

export interface TableRepositoryInterface {
  getInstance(
    schema: Schema | SchemaDefinition,
    tableName: string
  ): TableServiceInterface;
}
