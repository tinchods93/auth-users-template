import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ApplicationActionInterface } from '../interfaces/applicationActionInterface';
import { HandlerCommandType } from '../../../infrastructure/primary/handlers/types/handlerTypes';
import ZodSchemaValidation from '../../schemas/ZodSchema';
import ActionResponse from '../../entities/actionResponse';
import { ActionResponseInterface } from '../../entities/interfaces/actionResponseInterface';
import LicenseServiceInterface, {
  LICENSE_SERVICE_TOKEN,
} from '../../../domain/services/licenseService/interfaces/LicenseServiceInterface';
import { createLicenseActionInputSchema } from '../../schemas/zodSchemas/licenseActions/createLicenseActionInputSchema';

@injectable()
export default class CreateLicenseAction implements ApplicationActionInterface {
  private actionResponse: ActionResponseInterface;

  constructor(
    @inject(LICENSE_SERVICE_TOKEN)
    private licenseService: LicenseServiceInterface
  ) {
    this.actionResponse = new ActionResponse();
  }

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      const payload = new ZodSchemaValidation(
        createLicenseActionInputSchema
      ).validate(commandPayload.body);
      console.log(
        'MARTIN_LOG=> CreateLicenseAction -> execute -> payload',
        JSON.stringify(payload)
      );
      const response = await this.licenseService.addLicenseToUser(payload);

      return this.actionResponse.success({
        statusCode: StatusCodes.CREATED,
        data: response,
      });
    } catch (error) {
      return this.actionResponse.error({
        statusCode: error.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
        data: error,
      });
    }
  };
}
