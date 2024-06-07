import { HandlerCommandType } from '../../../infrastructure/primary/handlers/types/handlerTypes';

export interface ApplicationActionInterface {
  execute(
    commandPayload: HandlerCommandType,
    commandMeta?: any,
    rawMeta?: any
  ): Promise<any>;
}
