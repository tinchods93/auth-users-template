import dynamoose from 'dynamoose';
import { Schema, SchemaDefinition } from 'dynamoose/dist/Schema';
import { ModelType } from 'dynamoose/dist/General';
import { AnyItem } from 'dynamoose/dist/Item';
import isTest from '../../../commons/utils/isTest';
import { TableServiceInterface } from './interface/tableServiceInterface';

export default class TableService implements TableServiceInterface {
  private modelType!: ModelType<AnyItem>;

  constructor(schema: Schema | SchemaDefinition, tableName: string) {
    if (isTest) {
      dynamoose.aws.ddb.local(process.env.LOCALHOST);
      console.log('IS TEST');
    }

    this.modelType = dynamoose.model('Item', schema, {
      tableName,
      create: false,
      waitForActive: false,
    });
  }

  async create(data: any) {
    const model = new this.modelType(data);
    return model.save();
  }

  async query(params: { query: any; options?: any }) {
    const Model = this.modelType.query(params.query);

    if (params.options?.using_index) {
      Model.using(params.options.using_index);
    }
    console.log('MARTIN_LOG: TableService -> query -> params', params);
    const response = await Model.exec();
    console.log('MARTIN_LOG: TableService -> query -> response', response);
    return response;
  }
}
