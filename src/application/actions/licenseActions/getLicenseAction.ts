import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ApplicationActionInterface } from '../interfaces/applicationActionInterface';
import { HandlerCommandType } from '../../../infrastructure/primary/handlers/types/handlerTypes';
import ZodSchemaValidation from '../../schemas/ZodSchema';
import ActionResponse from '../../entities/actionResponse';
import { ActionResponseInterface } from '../../entities/interfaces/actionResponseInterface';
import { getLicenseActionInputSchema } from '../../schemas/zodSchemas/licenseActions/getLicenseActionInputSchema';
import StandaloneLicenseServiceInterface, {
  STANDALONE_LICENSE_SERVICE_TOKEN,
} from '../../../domain/services/licenseService/interfaces/LicenseServiceAloneInterface';

@injectable()
export default class GetLicenseAction implements ApplicationActionInterface {
  private actionResponse: ActionResponseInterface;

  constructor(
    @inject(STANDALONE_LICENSE_SERVICE_TOKEN)
    private standaloneLicenseService: StandaloneLicenseServiceInterface
  ) {
    this.actionResponse = new ActionResponse();
  }

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      const payload = new ZodSchemaValidation(
        getLicenseActionInputSchema
      ).validate(commandPayload.query);

      const response = await this.standaloneLicenseService.getLicense({
        licenseId: payload.license_id,
        userId: payload.user_id,
      });

      return this.actionResponse.success({
        statusCode: StatusCodes.OK,
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
