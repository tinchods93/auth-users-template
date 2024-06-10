import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../../commons/errors/errorHandler';
import { ErrorCodesEnum } from '../../commons/errors/enums/errorCodesEnum';
import { ErrorLayersEnum } from '../../commons/errors/enums/errorLayersEnum';

export default class SchemaValidationException {
  static handle({ message }) {
    const errorHandler = new ErrorHandler();
    return errorHandler.handle({
      message,
      code: ErrorCodesEnum.SCHEMA_VALIDATION_FAILED,
      layer: ErrorLayersEnum.APPLICATION,
      status: StatusCodes.BAD_REQUEST,
    });
  }
}
