import { EntitiesEnum } from '../../../enums/entitiesEnum';
import { LicenseType } from '../../license/types/licenseTypes';

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

export type UserEntityType = UserType & {
  email: string;
  personal_data: UserPersonalData;
  office_data?: OfficeData;
  parent_id?: string;
  office_id?: string;
  license?: LicenseType;
};

export type UserEntityTableItem = UserEntityType & {
  pk: string; // <type>#sub (sub es el sub que viene de cognito)
  sk: string; // <type>#sub (sub es el sub del usuario)
  user_id: string; // el sub que viene de cognito
  type: EntitiesEnum.USER;
  role: string;
};

export type UserEntityConstructorType = UserEntityType & {
  user_id: string;
};

export type UserPublicData = Omit<UserEntityTableItem, 'pk' | 'sk' | 'type'>;
