import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../../../commons/errors/errorHandler';
import { ErrorHandlerInterface } from '../../../commons/errors/interfaces/errorHandlerInterfaces';
import { CustomErrorType } from '../../../commons/errors/types/errorHandlerTypes';

export default class ServiceException {
  private ErrorHandler: ErrorHandlerInterface;

  constructor() {
    this.ErrorHandler = new ErrorHandler();
  }

  handle(input: CustomErrorType) {
    return this.ErrorHandler.handle({
      ...input,
      status: input.status ?? StatusCodes.CONFLICT,
    });
  }
}
