import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../../../commons/errors/errorHandler';
import { CustomErrorType } from '../../../commons/errors/types/errorHandlerTypes';

export default class ServiceException {
  static handle(input: CustomErrorType) {
    const errorHandler = new ErrorHandler();
    return errorHandler.handle({
      ...input,
      status: input.status ?? StatusCodes.CONFLICT,
    });
  }
}
