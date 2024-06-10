import {
  LicenseEntityConstructor,
  LicenseEntityData,
  LicenseEntityTableItemType,
} from '../types/licenseTypes';

export const LICENSE_ENTITY_TOKEN = Symbol('LicenseEntityInterface');

export interface LicenseEntityInterface {
  build(input: LicenseEntityConstructor): LicenseEntityTableItemType;
  getClean(input: LicenseEntityTableItemType): LicenseEntityData;
  updateExpirationDate(
    license: LicenseEntityTableItemType,
    durationInMonths: number
  ): LicenseEntityTableItemType;
  data: LicenseEntityTableItemType;
}
