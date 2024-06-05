import { RolesEnum } from '../../enums/rolesEnum';
import { LicenseType } from '../license/types/licenseTypes';
import {
  OfficeData,
  UserEntityConstructorType,
  UserEntityTableItem,
  UserPersonalData,
  UserPublicData,
} from './types/userTypes';
import { EntitiesEnum } from '../../enums/entitiesEnum';
import { UserEntityInterface } from './interface/userEntityInterface';
import { UserEntityDynamooseSchema } from './schema/userDynamooseSchema';

export default class UserEntity implements UserEntityInterface {
  private pk!: string; // <type>#sub (sub es el sub que viene de cognito)

  private sk!: string; // <type>#sub (sub es el sub del usuario)

  private username!: string;

  private email!: string;

  private type!: EntitiesEnum.USER;

  private user_id!: string;

  private role!: string;

  private personal_data!: UserPersonalData;

  private office_data?: OfficeData;

  private office_id?: string;

  private parent_id?: string;

  private license?: LicenseType;

  private schema = UserEntityDynamooseSchema;

  data!: UserEntityTableItem;

  build(input: UserEntityConstructorType) {
    this.username = input.username;
    this.email = input.email;
    this.license = input.license;
    this.personal_data = input.personal_data;
    this.office_data = input.office_data;
    this.parent_id = input.parent_id;
    this.office_id = input.office_data?.office_id;
    this.user_id = input.user_id;

    this.role = RolesEnum.USER;
    this.type = EntitiesEnum.USER;
    this.pk = `${this.type}#${this.user_id}`;
    this.sk = `${this.type}#${this.user_id}`;
    this.data = {
      pk: this.pk,
      sk: this.sk,
      username: this.username,
      email: this.email,
      type: this.type,
      user_id: this.user_id,
      role: this.role,
      personal_data: this.personal_data,
      office_data: this.office_data,
      office_id: this.office_id,
      parent_id: this.parent_id,
      license: this.license,
    };

    return this.data;
  }

  getTableSchema() {
    return this.schema;
  }

  getClean(input: UserEntityTableItem): UserPublicData {
    return {
      username: input.username,
      email: input.email,
      user_id: input.user_id,
      role: input.role,
      personal_data: input.personal_data,
      office_data: input.office_data,
      office_id: input.office_id,
      parent_id: input.parent_id,
      license: input.license,
    };
  }
}
