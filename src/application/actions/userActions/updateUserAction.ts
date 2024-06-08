import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ApplicationActionInterface } from '../interfaces/applicationActionInterface';
import { HandlerCommandType } from '../../../infrastructure/primary/handlers/types/handlerTypes';
import {
  USERS_SERVICE_TOKEN,
  UsersServiceInterface,
} from '../../services/interfaces/usersServiceInterface';
import ZodSchemaValidation from '../../schemas/ZodSchema';
import ActionResponse from '../../entities/actionResponse';
import { ActionResponseInterface } from '../../entities/interfaces/actionResponseInterface';
import { updateUserInputSchema } from '../../schemas/zodSchemas/updateUserInputSchema';

@injectable()
export default class UpdateUserAction implements ApplicationActionInterface {
  private actionResponse: ActionResponseInterface;

  constructor(
    @inject(USERS_SERVICE_TOKEN)
    private usersService: UsersServiceInterface
  ) {
    this.actionResponse = new ActionResponse();
  }

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      const payload = new ZodSchemaValidation(updateUserInputSchema).validate(
        commandPayload.body
      );
      const response = await this.usersService.updateUserProfile(payload);

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
