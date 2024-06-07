import logger from 'rebased/_helper/logger';
import { ErrorHandled as ExternalErrorHandler } from 'rebased/util/error';
import { CustomErrorType } from './types/errorHandlerTypes';
import isValidLayer from './utils/isValidLayer';
import { ErrorLayersEnum, layerFiller } from './enums/errorLayersEnum';
import { ErrorHandlerInterface } from './interfaces/errorHandlerInterfaces';

/**
 * Clase ErrorHandler que implementa la interfaz ErrorHandlerInterface.
 * Esta clase se utiliza para manejar errores personalizados.
 */
export default class ErrorHandler implements ErrorHandlerInterface {
  /**
   * Maneja el error personalizado proporcionado.
   * @param {CustomErrorType} input - El error personalizado a manejar.
   * @returns {ExternalErrorHandler} - El error manejado.
   */
  handle(input: CustomErrorType) {
    const { code, status, name, message, payload, layer, error } = input;
    const { message: msg, details, detail } = message || {};
    const finalMessage = msg ?? details ?? detail ?? message;

    if (error) logger.error(error);

    const finalLayer = this.getFinalLayer(
      layer as ErrorLayersEnum,
      code,
      error
    );

    if (error instanceof ExternalErrorHandler) {
      return this.createExternalErrorHandler(
        finalMessage,
        code,
        finalLayer,
        status,
        name
      );
    }

    if (payload) {
      logger.info({ payload_before_error: payload });
    }

    logger.info({
      message: 'CUSTOM_ERROR_MESSAGE',
      error_output: error ?? {
        message: finalMessage,
        code: code,
        layer: finalLayer,
        status,
        error_name: name,
      },
    });

    return this.createExternalErrorHandler(
      finalMessage,
      code,
      finalLayer,
      status,
      name
    );
  }

  /**
   * Obtiene la capa final para el error.
   * @param {ErrorLayersEnum | undefined} layer - La capa inicial.
   * @param {string} code - El código de error.
   * @param {{ layer: any }} error - El objeto de error.
   * @returns {string} - La capa final.
   */
  private getFinalLayer(
    layer: ErrorLayersEnum | undefined,
    code: string,
    error: { layer: any }
  ) {
    return isValidLayer(error?.layer)
      ? error.layer
      : layer?.replace(layerFiller, code);
  }

  /**
   * Crea una nueva instancia de ExternalErrorHandler.
   * @param {any} message - El mensaje de error.
   * @param {string} code - El código de error.
   * @param {ErrorLayersEnum} layer - La capa de error.
   * @param {number | undefined} status - El estado del error.
   * @param {string | undefined} name - El nombre del error.
   * @returns {ExternalErrorHandler} - La nueva instancia de ExternalErrorHandler.
   */
  private createExternalErrorHandler(
    message: any,
    code: string,
    layer: ErrorLayersEnum,
    status: number | undefined,
    name: string | undefined
  ) {
    return new ExternalErrorHandler(
      message,
      {
        code: code,
        layer: layer,
        status,
      },
      name
    );
  }
}
