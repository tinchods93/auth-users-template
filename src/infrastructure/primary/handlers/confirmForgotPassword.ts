import 'reflect-metadata';
import commandInput from 'rebased/handler/input/commandApi';
import commandOutput from 'rebased/handler/output/commandApi';
import { commandMapper } from 'rebased/handler';
import { HandlerCommandType } from './types/handlerTypes';
import diContainer from '../../../diContainer';
import ConfirmForgotPasswordUserAction from '../../../application/actions/confirmForgotPasswordUserAction';
import validateTokenScopes from '../utils/validateTokenScopes';

export const handler = async (command: HandlerCommandType, context: any) => {
  const action = diContainer.resolve(ConfirmForgotPasswordUserAction);
  console.log('MARTIN_LOG=> handler=>action=> ', action);

  return commandMapper(
    { command, context },
    commandInput,
    action.execute,
    commandOutput
  );
};