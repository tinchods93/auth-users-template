import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ApplicationActionInterface } from './interface/applicationActionInterface';
import { HandlerCommandType } from '../../infrastructure/primary/handlers/types/handlerTypes';
import {
  USERS_SERVICE_TOKEN,
  UsersServiceInterface,
} from '../services/interfaces/usersServiceInterface';
import { registerUserInputSchema } from '../schemas/zodSchemas/registerUserInputSchema';
import ZodSchemaValidation from '../schemas/ZodSchema';
import ActionResponse from '../entities/actionResponse';
import { ActionResponseInterface } from '../entities/interfaces/actionResponseInterface';

@injectable()
export default class RegisterUserAction implements ApplicationActionInterface {
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
        'MARTIN_LOG=>registerUserAction=>execute=>commandPayload: ',
        commandPayload
      );

      const payload = new ZodSchemaValidation(registerUserInputSchema).validate(
        commandPayload.body
      );

      console.log(
        'MARTIN_LOG=>registerUserAction=>execute=>payload: ',
        payload
      );

      const response = await this.usersService.register(payload);

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
