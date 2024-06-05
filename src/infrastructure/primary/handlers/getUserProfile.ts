import 'reflect-metadata';
import jwt from 'jsonwebtoken';
import commandInput from 'rebased/handler/input/commandApi';
import commandOutput from 'rebased/handler/output/commandApi';
import { commandMapper } from 'rebased/handler';
import { HandlerCommandType } from './types/handlerTypes';
import diContainer from '../../../diContainer';
import GetUserProfileAction from '../../../application/actions/getUserProfileAction';
import validateTokenScopes from '../utils/validateTokenScopes';

export const handler = async (command: HandlerCommandType, context: any) => {
  console.log('MARTIN_LOG=> inputs', { command, context });
  const token = command.headers.Authorization;

  console.log('MARTIN_LOG=> validatingTokenScopes...');

  if (!validateTokenScopes(token)) {
    console.log('MARTIN_LOG=> Invalid token');
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }
  console.log('MARTIN_LOG=> valid token');

  const action = diContainer.resolve(GetUserProfileAction);

  return commandMapper(
    { command, context },
    commandInput,
    action.execute,
    commandOutput
  );
};
