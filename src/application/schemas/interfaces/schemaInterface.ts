/**
 * `SchemaInterface` es una interfaz que define un contrato para los objetos que implementan la validación de esquemas.
 *
 * @interface
 */
export interface SchemaInterface {
  /**
   * El método `validate` se utiliza para validar el esquema y debe ser implementado por cualquier clase que implemente `SchemaInterface`.
   * El tipo de retorno `any` significa que el método puede devolver cualquier tipo de dato, pero generalmente se espera que devuelva un objeto que represente el estado de la validación o lance una excepción si la validación falla.
   *
   * @returns {any} El resultado de la validación del esquema.
   */
  validate: (payload: any) => any;
}
