import { TableRepositoryInterface } from './interfaces/tableRepositoryInterface';
import { TableServiceInterface } from '../services/interface/tableServiceInterface';
import TableService from '../services/tableService';

/**
 * Clase TableRepository que implementa la interfaz TableRepositoryInterface.
 * Esta clase se utiliza para obtener instancias de TableService.
 */
export default class TableRepository implements TableRepositoryInterface {
  /**
   * Obtiene una instancia de TableService.
   * @param {any} schema - El esquema de la tabla.
   * @param {string} tableName - El nombre de la tabla.
   * @returns {TableServiceInterface} - Una instancia de TableService.
   */
  getInstance(schema: any, tableName: string): TableServiceInterface {
    return new TableService(schema, tableName);
  }
}
