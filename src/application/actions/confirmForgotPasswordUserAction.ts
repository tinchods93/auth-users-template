import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ApplicationActionInterface } from './interface/applicationActionInterface';
import { HandlerCommandType } from '../../infrastructure/primary/handlers/types/handlerTypes';
import {
  USERS_SERVICE_TOKEN,
  UsersServiceInterface,
} from '../services/interfaces/usersServiceInterface';

@injectable()
export default class ConfirmForgotPasswordUserAction
  implements ApplicationActionInterface
{
  constructor(
    @inject(USERS_SERVICE_TOKEN)
    private usersService: UsersServiceInterface
  ) {}

  public execute = async (commandPayload: HandlerCommandType) => {
    try {
      console.log(
        'MARTIN_LOG=>ForgotPasswordUserAction=>execute=>commandPayload: ',
        commandPayload
      );

      const payload = {
        username: commandPayload.parameters.username,
        newPassword: commandPayload.body.newPassword,
        confirmationCode: commandPayload.body.confirmationCode,
      };

      console.log(
        'MARTIN_LOG=> ForgotPasswordUserAction=>execute=>payload: ',
        payload
      );

      const response = await this.usersService.confirmForgotPassword(payload);

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
