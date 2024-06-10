import { TableItemDynamooseSchema } from '../../schemas/tableDynamooseSchema';
import { BasicEntityInterface } from './interface/basicEntityInterface';

export default class BasicEntity implements BasicEntityInterface {
  protected schema = TableItemDynamooseSchema;

  getTableSchema() {
    return this.schema;
  }
}
