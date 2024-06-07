import { ConditionInitializer } from 'dynamoose/dist/Condition';
import dynamoose from 'dynamoose';
import { Schema, SchemaDefinition } from 'dynamoose/dist/Schema';
import { ModelType, ObjectType } from 'dynamoose/dist/General';
import { AnyItem } from 'dynamoose/dist/Item';
import isTest from '../../../commons/utils/isTest';
import { TableServiceInterface } from './interface/tableServiceInterface';
import { ErrorHandlerInterface } from '../../../commons/errors/interfaces/errorHandlerInterfaces';
import TableException from '../errors/tableException';

/**
 * Clase TableService que implementa la interfaz TableServiceInterface.
 * Esta clase se utiliza para interactuar con una tabla en DynamoDB.
 */
export default class TableService implements TableServiceInterface {
  private modelType!: ModelType<AnyItem>;

  private TableException: ErrorHandlerInterface;

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
    this.TableException = new TableException();
  }

  /**
   * Crea un nuevo elemento en la tabla.
   * @param {any} data - Los datos del elemento a crear.
   * @returns {Promise<any>} - El elemento creado.
   * @throws {TableException} - Si ocurre un error al crear el elemento.
   */
  async create(data: any) {
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
  async query(params: {
    query: ConditionInitializer;
    options?: {
      using_index?: string;
    };
  }): Promise<ObjectType[] | undefined> {
    console.log('MARTIN_LOG: TableService -> query -> params', params);
    const Model = this.modelType.query(params.query);

    if (params.options?.using_index) {
      Model.using(params.options.using_index);
    }

    console.log('MARTIN_LOG=> TableService=>query=>Model=> ', Model);
    console.log(
      'MARTIN_LOG=> TableService=>query=>Model stringify=> ',
      JSON.stringify(Model)
    );
    const response = await Model.exec();

    if (!response) return undefined;

    return response.map((item) => item.toJSON());
  }
}
