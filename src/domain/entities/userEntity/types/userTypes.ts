import { TableItemType } from '../../../../infrastructure/secondary/services/types/tableServiceTypes';
import { LicenseEntityType } from '../../license/licenseEntity/types/licenseTypes';

export type UserPersonalData = {
  name: string;
  last_name: string;
  address: string;
  dni: string;
  phone_number: string;
  birth_date: string;
};

export type OfficeData = {
  office_id: string;
  name: string;
  address: string;
  cuit: string;
  phone_number: string;
  email: string;
};

export type UserType = {
  username: string; // gsi
  email: string;
};

export type UserModifiableData = {
  personal_data?: UserPersonalData;
  office_data?: OfficeData;
  parent_id?: string;
  office_id?: string;
  license_id?: string;
};

export type UserEntityType = UserType & UserModifiableData;

export type UserEntityTableItem = UserEntityType &
  TableItemType & {
    user_id: string; // el sub que viene de cognito
    role: string;
    creation_date: number;
    update_date: number;
  };

export type UserEntityConstructorType = UserEntityType & {
  user_id: string;
};

export type UserPublicData = Omit<UserEntityTableItem, 'pk' | 'sk' | 'type'>;

export type UserProfileData = UserPublicData & {
  license?: LicenseEntityType;
};
