import { LicenseTypeEnum } from '../enum/licensesEnum';
import { LicenseEntityConfigType } from '../types/licenseTypes';

export const licenseConfig: LicenseEntityConfigType = {
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
