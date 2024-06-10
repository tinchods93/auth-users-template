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
import { getLicenseByUserActionInputSchema } from '../../schemas/zodSchemas/licenseActions/getLicenseByUserActionInputSchema';

@injectable()
export default class GetLicenseByIdAction
  implements ApplicationActionInterface
{
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
        getLicenseByUserActionInputSchema
      ).validate(commandPayload.body);
      const response = await this.licenseService.getLicenseById({
        licenseId: payload.license_id,
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
