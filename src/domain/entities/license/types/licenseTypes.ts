import { LicenseStatusEnum, LicenseTypeEnum } from '../enum/licensesEnum';

export type LicenseLimitsType = {
  max_users: number;
  max_projects?: number;
};

export type LicenseConfigType = {
  [key in LicenseTypeEnum]: {
    limits: LicenseLimitsType;
  };
};

export type LicenseType = {
  license_type: string;
  status: LicenseStatusEnum;
  limits: LicenseLimitsType;
  creation_date: number;
  expiration_date: number;
};

export type LicenseConstructor = {
  license_type: LicenseTypeEnum;
  user_id: string;
};

export type LicenseTableItemType = {
  pk: string; // pk del usuario
  sk: string; // <type>#license_id
  type: string;
  license_id: string;
  user_id: string;
  license_data: LicenseType;
};
