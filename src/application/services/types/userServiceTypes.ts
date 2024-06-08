import {
  UserEntityType,
  UserModifiableData,
} from '../../../domain/entities/user/types/userTypes';

export type UserServiceRegisterInputType = UserEntityType & {
  temporaryPassword: string;
};

export type UserServiceLoginInputType = {
  username: string;
  password: string;
};

export type UserServiceForgotPasswordInputType = {
  username: string;
};

export type UserServiceChangePasswordInputType = {
  username: string;
  newPassword: string;
  session: string;
};

export type UserServiceConfirmForgotPasswordInputType = {
  username: string;
  newPassword: string;
  confirmationCode: string;
};

export type UsersServiceGetUserInputType = {
  user_id: string;
};

export type UsersServiceUpdateUserInputType = UsersServiceGetUserInputType &
  UserModifiableData;
