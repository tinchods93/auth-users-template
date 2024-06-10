import dynamoose from 'dynamoose';
import { Schema, SchemaDefinition } from 'dynamoose/dist/Schema';
import { ModelType, ObjectType } from 'dynamoose/dist/General';
import { AnyItem } from 'dynamoose/dist/Item';
import isTest from '../../../commons/utils/isTest';
import { TableServiceInterface } from './interface/tableServiceInterface';
import {
  CreateTableItemMethodInput,
  QueryTableItemMethodInput,
  UpdateTableItemMethodInput,
} from './types/tableServiceTypes';

/**
 * Clase TableService que implementa la interfaz TableServiceInterface.
 * Esta clase se utiliza para interactuar con una tabla en DynamoDB.
 */
export default class TableService implements TableServiceInterface {
  private modelType!: ModelType<AnyItem>;

  /**
   * Constructor de la clase TableService.
   * @param {Schema | SchemaDefinition} schema - El esquema de la tabla.
   * @param {string} tableName - El nombre de la tabla.
   */
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

  /**
   * Crea un nuevo elemento en la tabla.
   * @param {any} data - Los datos del elemento a crear.
   * @returns {Promise<any>} - El elemento creado.
   * @throws {TableException} - Si ocurre un error al crear el elemento.
   */
  async create(data: CreateTableItemMethodInput) {
    const model = new this.modelType(data);
    return model.save();
  }

  /**
   * Realiza una consulta a la tabla.
   * @param {Object} params - Los parámetros de la consulta.
   * @param {any} params.query - La consulta a realizar.
   * @param {any} [params.options] - Las opciones de la consulta.
   * @returns {Promise<ObjectType[] | undefined>} - Los elementos que coinciden con la consulta.
   * @throws {TableException} - Si ocurre un error al realizar la consulta.
   */
  async query(
    params: QueryTableItemMethodInput
  ): Promise<ObjectType[] | undefined> {
    console.log(
      'MARTIN_LOG: TableService -> query -> params',
      JSON.stringify(params)
    );
    const Model = this.modelType.query(params.query);

    if (params.options?.using_index) {
      Model.using(params.options.using_index);
    }

    const response = await Model.exec();

    console.log(
      'MARTIN_LOG: TableService -> query -> response',
      JSON.stringify(response)
    );
    if (!response) return undefined;

    return response.map((item) => item.toJSON());
  }

  async update(
    params: UpdateTableItemMethodInput
  ): Promise<ObjectType | undefined> {
    const response = (
      await this.modelType.update(params.key, params.payload, {
        returnValues: 'ALL_NEW',
      })
    ).toJSON();

    console.log(
      'MARTIN_LOG=> TableService -> update -> response',
      JSON.stringify(response)
    );

    if (!response) return undefined;

    return response;
  }
}
