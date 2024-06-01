import { UserType } from '../../../domain/types/userTypes';
import { CognitoAuthenticationResponseType } from '../../../infrastructure/secondary/repository/types/cognitoServiceTypes';

export const USERS_SERVICE_TOKEN = Symbol('UsersServiceToken');

export interface UsersServiceInterface {
  create(user: UserType): Promise<any>;
  authenticate(payload: {
    username: string;
    password: string;
  }): Promise<CognitoAuthenticationResponseType>;
  changePassword(payload): Promise<any>;
  forgotPassword(payload: { username: string }): Promise<any>;
  confirmForgotPassword(payload: {
    username: string;
    newPassword: string;
    confirmationCode: string;
  }): Promise<any>;
}
