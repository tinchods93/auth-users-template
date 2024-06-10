import 'reflect-metadata';
import commandInput from 'rebased/handler/input/commandApi';
import commandOutput from 'rebased/handler/output/commandApi';
import { commandMapper } from 'rebased/handler';
import { HandlerCommandType } from '../types/handlerTypes';
import depsContainer from '../../../../depsContainer';
import RenewLicenseAction from '../../../../application/actions/licenseActions/renewLicenseAction';

export const handler = async (command: HandlerCommandType, context: any) => {
  const action = depsContainer.resolve(RenewLicenseAction);

  return commandMapper(
    { command, context },
    commandInput,
    action.execute,
    commandOutput
  );
};
