import { StatusCodes } from 'http-status-codes';
import { ErrorHandlerInterface } from '../../commons/errors/interfaces/errorHandlerInterfaces';
import ErrorHandler from '../../commons/errors/errorHandler';
import { CustomErrorType } from '../../commons/errors/types/errorHandlerTypes';

export default class UserServiceException implements ErrorHandlerInterface {
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
