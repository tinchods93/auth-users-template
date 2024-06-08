import 'reflect-metadata';
import commandInput from 'rebased/handler/input/commandApi';
import commandOutput from 'rebased/handler/output/commandApi';
import { commandMapper } from 'rebased/handler';
import { HandlerCommandType } from './types/handlerTypes';
import depsContainer from '../../../depsContainer';
import validateTokenScopes from '../utils/validateTokenScopes';
import UpdateUserAction from '../../../application/actions/userActions/updateUserAction';

export const handler = async (command: HandlerCommandType, context: any) => {
  const token = command.headers.Authorization;

  if (!validateTokenScopes(token)) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }

  const action = depsContainer.resolve(UpdateUserAction);

  return commandMapper(
    { command, context },
    commandInput,
    action.execute,
    commandOutput
  );
};
