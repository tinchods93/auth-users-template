import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../../../commons/errors/errorHandler';
import { CustomErrorType } from '../../../commons/errors/types/errorHandlerTypes';
import { ErrorLayersEnum } from '../../../commons/errors/enums/errorLayersEnum';

export default class UserServiceException {
  static handle(input: CustomErrorType) {
    const errorHandler = new ErrorHandler();
    return errorHandler.handle({
      ...input,
      status: input.status ?? StatusCodes.CONFLICT,
      layer: ErrorLayersEnum.DOMAIN,
    });
  }
}
