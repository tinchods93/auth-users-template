import { UserType } from '../../../domain/types/userTypes';

export const USERS_SERVICE_TOKEN = Symbol('UsersServiceToken');

export interface UsersServiceInterface {
  create(user: UserType): Promise<any>;
  authenticate(payload: { username: string; password: string }): Promise<any>;
  changePassword(payload: {
    username: string;
    newPassword: string;
    session: string;
  }): Promise<any>;
  forgotPassword(payload: { username: string }): Promise<any>;
  confirmForgotPassword(payload: {
    username: string;
    newPassword: string;
    confirmationCode: string;
  }): Promise<any>;
  getUserProfile(payload: { username: string }): Promise<any>;
}
