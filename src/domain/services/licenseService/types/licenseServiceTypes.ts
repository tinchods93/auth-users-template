import { LicenseTypeEnum } from '../../../entities/license/licenseEntity/enum/licensesEnum';

export type AddLicenseToUserParams = {
  userId: string;
  licenseType?: LicenseTypeEnum;
  durationInMonths?: number;
};

export type GetLicenseByUserParams = {
  userId: string;
};

export type GetLicenseByIdParams = {
  licenseId: string;
};

export type RenewLicenseParams = {
  inputLicenseId: string;
  durationInMonths: number;
};

export type RevokeLicenseParams = {
  licenseId: string;
};
