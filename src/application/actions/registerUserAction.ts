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

@injectable()
export default class RegisterUserAction implements ApplicationActionInterface {
  constructor(
    @inject(USERS_SERVICE_TOKEN)
    private usersService: UsersServiceInterface
  ) {}

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

      return {
        status: 201,
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
