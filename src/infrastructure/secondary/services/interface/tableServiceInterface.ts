export const TABLE_SERVICE_TOKEN = Symbol('TableServiceInterface');

export interface TableServiceInterface {
  create(data: {
    pk: string;
    sk: string;
    type: string;
    [key: string]: any;
  }): Promise<any>;
  query(params: { query: any; options?: any }): Promise<any>;
}
