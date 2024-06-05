import { RolesEnum } from '../enums/rolesEnum';
import { UserEntityConstructorType, UserEntityType } from '../types/userTypes';

export default class UserEntity {
  private username: string;

  private temporaryPassword: string;

  private email: string;

  private role: string;

  private licence?: string;

  data: UserEntityType | UserEntityConstructorType;

  constructor({
    username,
    temporaryPassword,
    email,
    role,
    licence,
  }: UserEntityConstructorType) {
    this.username = username;
    this.temporaryPassword = temporaryPassword;
    this.email = email;
    this.role = role ?? RolesEnum.USER;
    this.licence = licence;

    this.data = {
      username: this.username,
      email: this.email,
      role: this.role,
      licence: this.licence,
    };
  }
}
