import { LicenseTypeEnum } from '../enum/licensesEnum';
import { LicenseConfigType } from '../types/licenseTypes';

export const licenseConfig: LicenseConfigType = {
  [LicenseTypeEnum.PREMIUM]: {
    limits: {
      max_users: 5,
    },
  },
  [LicenseTypeEnum.STANDARD]: {
    limits: {
      max_users: 1,
      max_projects: 10,
    },
  },
};
