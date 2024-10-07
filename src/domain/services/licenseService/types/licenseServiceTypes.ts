import { LicenseTypeEnum } from '../../../entities/license/licenseEntity/enum/licensesEnum';

export type AddLicenseToUserParams = {
  userId: string;
  licenseType?: LicenseTypeEnum;
  durationInMonths?: number;
};

export type getLicenseByUserIdParams = {
  userId: string;
};

export type GetLicenseParams = {
  licenseId?: string;
  userId?: string;
};

export type RenewLicenseParams = {
  licenseId: string;
  durationInMonths: number;
};

export type RevokeLicenseParams = {
  licenseId: string;
};

export type LicenseServiceResponseType = {
  status: string;
  data: any;
};
