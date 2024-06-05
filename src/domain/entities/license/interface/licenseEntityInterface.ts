import { LicenseTableItemType } from '../types/licenseTypes';

export const LICENSE_ENTITY_TOKEN = Symbol('LicenseEntityInterface');

export interface LicenseEntityInterface {
  data: LicenseTableItemType;
}
