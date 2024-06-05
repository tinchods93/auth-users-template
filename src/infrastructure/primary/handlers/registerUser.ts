import 'reflect-metadata';
import commandInput from 'rebased/handler/input/commandApi';
import commandOutput from 'rebased/handler/output/commandApi';
import { commandMapper } from 'rebased/handler';
import { HandlerCommandType } from './types/handlerTypes';
import diContainer from '../../../diContainer';
import RegisterUserAction from '../../../application/actions/registerUserAction';
//import validateTokenScopes from '../utils/validateTokenScopes';

export const handler = async (command: HandlerCommandType, context: any) => {
  // const token = command.headers.Authorization;

  // // console.log('MARTIN_LOG=> validatingTokenScopes...');
  // // if (!validateTokenScopes(token)) {
  // //   return {
  // //     statusCode: 401,
  // //     body: JSON.stringify({ message: 'Unauthorized' }),
  // //   };
  // // }
  // // console.log('MARTIN_LOG=> validatingTokenScopes...');

  const action = diContainer.resolve(RegisterUserAction);
  console.log('MARTIN_LOG=> handler=>action=> ', action);

  return commandMapper(
    { command, context },
    commandInput,
    action.execute,
    commandOutput
  );
};
