import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ApplicationActionInterface } from './interface/applicationActionInterface';
import { HandlerCommandType } from '../../infrastructure/primary/handlers/types/handlerTypes';
import {
  USERS_SERVICE_TOKEN,
  UsersServiceInterface,
} from '../services/interfaces/usersServiceInterface';
import { newPasswordChallengeInputSchema } from '../schemas/zodSchemas/newPasswordChallengeInputSchema';
import ZodSchemaValidation from '../schemas/ZodSchema';

@injectable()
export default class NewPasswordChallengeUserAction
  implements ApplicationActionInterface
{
  constructor(
    @inject(USERS_SERVICE_TOKEN)
    private usersService: UsersServiceInterface
  ) {}

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      console.log(
        'MARTIN_LOG=>NewPasswordChallengeUserAction=>execute=>commandPayload: ',
        commandPayload
      );

      const payload = new ZodSchemaValidation(
        newPasswordChallengeInputSchema
      ).validate({
        username: commandPayload.parameters.username,
        newPassword: commandPayload.body.newPassword,
        session: commandPayload.body.session,
      });

      console.log(
        'MARTIN_LOG=>NewPasswordChallengeUserAction=>execute=>payload: ',
        payload
      );

      const response = await this.usersService.changePassword(payload);

      return {
        status: 200,
        body: response,
      };
    } catch (error) {
      return {
        status: error.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          message: error.message,
          error,
        },
      };
    }
  };
}