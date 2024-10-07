import 'reflect-metadata';
import commandInput from 'rebased/handler/input/commandApi';
import commandOutput from 'rebased/handler/output/commandApi';
import { commandMapper } from 'rebased/handler';
import { HandlerCommandType } from '../types/handlerTypes';
import depsContainer from '../../../../depsContainer';
import ValidateSessionTokenAction from '../../../../application/actions/userActions/validateSessionTokenAction';

export const handler = async (command: HandlerCommandType, context: any) => {
  const action = depsContainer.resolve(ValidateSessionTokenAction);

  return commandMapper(
    { command, context },
    commandInput,
    action.execute,
    commandOutput
  );
};
