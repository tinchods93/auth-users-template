import { BasicEntityInterface } from '../../../basicEntity/interface/basicEntityInterface';
import {
  LicenseHistoryEntityConstructorInput,
  LicenseHistoryEntityTableItemType,
  LicenseHistoryEntityType,
} from '../types/licenseHistoryEntityTypes';

export const LICENSE_HISTORY_ENTITY_TOKEN = Symbol(
  'LicenseHistoryEntityInterface'
);

export interface LicenseHistoryEntityInterface extends BasicEntityInterface {
  build(
    input: LicenseHistoryEntityConstructorInput
  ): LicenseHistoryEntityTableItemType;
  getClean(): LicenseHistoryEntityType;
}
