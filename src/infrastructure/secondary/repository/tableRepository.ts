import { TableRepositoryInterface } from './interfaces/tableRepositoryInterface';
import { TableServiceInterface } from '../services/interface/tableServiceInterface';
import TableService from '../services/tableService';

export default class TableRepository implements TableRepositoryInterface {
  getInstance(schema: any, tableName: string): TableServiceInterface {
    return new TableService(schema, tableName);
  }
}
