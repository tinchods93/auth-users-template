import { TableItemType } from '../../../../../infrastructure/secondary/services/types/tableServiceTypes';
import { LicenseStatusEnum, LicenseTypeEnum } from '../enum/licensesEnum';

export type LicenseEntityLimitsType = {
  max_users: number;
  max_projects?: number;
};

export type LicenseEntityConfigType = {
  [key in LicenseTypeEnum]: {
    limits: LicenseEntityLimitsType;
  };
};

export type LicenseEntityType = {
  status: LicenseStatusEnum;
  limits: LicenseEntityLimitsType;
  creation_date: number;
  expiration_date: number;
  update_date: number;
};

export type LicenseEntityConstructor = {
  user_id: string;
  license_type?: LicenseTypeEnum;
  duration_in_Months?: number;
};

export type LicenseEntityData = {
  license_type: LicenseTypeEnum;
  license_id: string;
  user_id: string;
  license_data: LicenseEntityType;
};

export type LicenseEntityTableItemType = LicenseEntityData & TableItemType;
