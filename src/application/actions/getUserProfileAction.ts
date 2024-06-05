import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ApplicationActionInterface } from './interface/applicationActionInterface';
import { HandlerCommandType } from '../../infrastructure/primary/handlers/types/handlerTypes';
import {
  USERS_SERVICE_TOKEN,
  UsersServiceInterface,
} from '../services/interfaces/usersServiceInterface';
import ZodSchemaValidation from '../schemas/ZodSchema';
import { getUserProfileInputSchema } from '../schemas/zodSchemas/getUserProfileInputSchema';

@injectable()
export default class GetUserProfileAction
  implements ApplicationActionInterface
{
  constructor(
    @inject(USERS_SERVICE_TOKEN)
    private usersService: UsersServiceInterface
  ) {}

  public execute = async (
    commandPayload: HandlerCommandType,
    commandMeta,
    rawMeta
  ) => {
    try {
      console.log(
        'MARTIN_LOG=>GetUserProfileAction=>execute=> input: ',
        JSON.stringify({ commandMeta, rawMeta })
      );

      const payload = new ZodSchemaValidation(
        getUserProfileInputSchema
      ).validate(commandPayload.parameters);

      console.log(
        'MARTIN_LOG=>GetUserProfileAction=>execute=>payload: ',
        payload
      );

      const response = await this.usersService.getUserProfile(payload);

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
