import 'reflect-metadata';
import commandInput from 'rebased/handler/input/commandApi';
import commandOutput from 'rebased/handler/output/commandApi';
import { commandMapper } from 'rebased/handler';
import { HandlerCommandType } from '../types/handlerTypes';
import depsContainer from '../../../../depsContainer';
import RevokeLicenseAction from '../../../../application/actions/licenseActions/revokeLicenseAction';

export const handler = async (command: HandlerCommandType, context: any) => {
  const action = depsContainer.resolve(RevokeLicenseAction);

  return commandMapper(
    { command, context },
    commandInput,
    action.execute,
    commandOutput
  );
};
