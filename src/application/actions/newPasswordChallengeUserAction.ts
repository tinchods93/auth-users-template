import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ApplicationActionInterface } from './interfaces/applicationActionInterface';
import { HandlerCommandType } from '../../infrastructure/primary/handlers/types/handlerTypes';
import {
  USERS_SERVICE_TOKEN,
  UsersServiceInterface,
} from '../services/interfaces/usersServiceInterface';
import { newPasswordChallengeInputSchema } from '../schemas/zodSchemas/newPasswordChallengeInputSchema';
import ZodSchemaValidation from '../schemas/ZodSchema';
import { ActionResponseInterface } from '../entities/interfaces/actionResponseInterface';
import ActionResponse from '../entities/actionResponse';

@injectable()
export default class NewPasswordChallengeUserAction
  implements ApplicationActionInterface
{
  private actionResponse: ActionResponseInterface;

  constructor(
    @inject(USERS_SERVICE_TOKEN)
    private usersService: UsersServiceInterface
  ) {
    this.actionResponse = new ActionResponse();
  }

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      const payload = new ZodSchemaValidation(
        newPasswordChallengeInputSchema
      ).validate({
        username: commandPayload.parameters.username,
        newPassword: commandPayload.body.newPassword,
        session: commandPayload.body.session,
      });

      const response = await this.usersService.changePassword(payload);

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
