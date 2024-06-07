import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ApplicationActionInterface } from './interface/applicationActionInterface';
import { HandlerCommandType } from '../../infrastructure/primary/handlers/types/handlerTypes';
import {
  USERS_SERVICE_TOKEN,
  UsersServiceInterface,
} from '../services/interfaces/usersServiceInterface';
import ZodSchemaValidation from '../schemas/ZodSchema';
import { loginUserInputSchema } from '../schemas/zodSchemas/loginUserInputSchema';
import { ActionResponseInterface } from '../entities/interfaces/actionResponseInterface';
import ActionResponse from '../entities/actionResponse';

@injectable()
export default class LoginUserAction implements ApplicationActionInterface {
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
        'MARTIN_LOG=> LoginUserAction=>execute=>commandPayload: ',
        commandPayload
      );

      const payload = new ZodSchemaValidation(loginUserInputSchema).validate(
        commandPayload.body
      );

      console.log('MARTIN_LOG=>LoginUserAction=>execute=>payload: ', payload);

      const response = await this.usersService.login(payload);

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
