import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ApplicationActionInterface } from './interface/applicationActionInterface';
import { HandlerCommandType } from '../../infrastructure/primary/handlers/types/handlerTypes';
import {
  USERS_SERVICE_TOKEN,
  UsersServiceInterface,
} from '../services/interfaces/usersServiceInterface';
import { forgotPasswordInputSchema } from '../schemas/zodSchemas/forgotPasswordInputSchema';
import ZodSchemaValidation from '../schemas/ZodSchema';
import ActionResponse from '../entities/actionResponse';
import { ActionResponseInterface } from '../entities/interfaces/actionResponseInterface';

@injectable()
export default class ForgotPasswordUserAction
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
      console.log(
        'MARTIN_LOG=>ForgotPasswordUserAction=>execute=>commandPayload: ',
        commandPayload
      );

      const payload = new ZodSchemaValidation(
        forgotPasswordInputSchema
      ).validate(commandPayload.parameters);

      console.log(
        'MARTIN_LOG=> ForgotPasswordUserAction=>execute=>payload: ',
        payload
      );

      const response = await this.usersService.forgotPassword(payload);

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
