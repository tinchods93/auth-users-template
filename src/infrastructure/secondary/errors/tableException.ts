import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../../../commons/errors/errorHandler';
import { ErrorHandlerInterface } from '../../../commons/errors/interfaces/errorHandlerInterfaces';
import { CustomErrorType } from '../../../commons/errors/types/errorHandlerTypes';
import { ErrorLayersEnum } from '../../../commons/errors/enums/errorLayersEnum';

export default class TableException {
  private ErrorHandler: ErrorHandlerInterface;

  constructor() {
    this.ErrorHandler = new ErrorHandler();
  }

  handle(input: CustomErrorType) {
    return this.ErrorHandler.handle({
      ...input,
      layer: `${ErrorLayersEnum.INFRASTRUCTURE}#DynamoAdapter`,
      status: input.status ?? StatusCodes.CONFLICT,
    });
  }
}
