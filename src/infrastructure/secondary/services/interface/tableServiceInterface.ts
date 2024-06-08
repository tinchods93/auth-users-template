import {
  CreateTableItemMethodInput,
  QueryTableItemMethodInput,
  UpdateTableItemMethodInput,
} from '../types/tableServiceTypes';

export const TABLE_SERVICE_TOKEN = Symbol('TableServiceInterface');

export interface TableServiceInterface {
  create(data: CreateTableItemMethodInput): Promise<any>;
  query(params: QueryTableItemMethodInput): Promise<any[] | undefined>;
  update(params: UpdateTableItemMethodInput): Promise<any>;
}
