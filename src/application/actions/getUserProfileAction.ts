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
import ActionResponse from '../entities/actionResponse';
import { ActionResponseInterface } from '../entities/interfaces/actionResponseInterface';

@injectable()
export default class GetUserProfileAction
  implements ApplicationActionInterface
{
  private actionResponse: ActionResponseInterface;

  constructor(
    @inject(USERS_SERVICE_TOKEN)
    private usersService: UsersServiceInterface
  ) {
    this.actionResponse = new ActionResponse();
  }

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
