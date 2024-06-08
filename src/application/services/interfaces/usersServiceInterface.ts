import { UserPublicData } from '../../../domain/entities/user/types/userTypes';
import { CognitoAuthenticationResponseType } from '../../../infrastructure/secondary/repository/types/cognitoServiceTypes';
import {
  UserServiceChangePasswordInputType,
  UserServiceConfirmForgotPasswordInputType,
  UserServiceLoginInputType,
  UserServiceRegisterInputType,
  UsersServiceGetUserInputType,
  UsersServiceUpdateUserInputType,
} from '../types/userServiceTypes';

export const USERS_SERVICE_TOKEN = Symbol('UsersServiceToken');

export interface UsersServiceInterface {
  register(payload: UserServiceRegisterInputType): Promise<any>;
  login(
    payload: UserServiceLoginInputType
  ): Promise<CognitoAuthenticationResponseType>;
  changePassword(payload: UserServiceChangePasswordInputType): Promise<any>;
  forgotPassword(payload: { username: string }): Promise<any>;
  confirmForgotPassword(
    payload: UserServiceConfirmForgotPasswordInputType
  ): Promise<any>;
  getUserProfile(
    payload: UsersServiceGetUserInputType,
    returnRaw?: boolean
  ): Promise<UserPublicData>;
  updateUserProfile(
    payload: UsersServiceUpdateUserInputType
  ): Promise<UserPublicData>;
}
