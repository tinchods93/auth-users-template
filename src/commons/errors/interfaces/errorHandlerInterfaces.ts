import { CustomErrorType } from '../types/errorHandlerTypes';

export interface ErrorHandlerInterface {
  handle(input: CustomErrorType): any;
}
