import {
  AdminGetUserCommandOutput,
  AdminInitiateAuthCommandOutput,
  AdminRespondToAuthChallengeCommandOutput,
  ConfirmForgotPasswordCommandOutput,
  ForgotPasswordCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoUserType } from '../types/cognitoServiceTypes';

export const COGNITO_REPOSITORY_TOKEN = Symbol('CognitoRepositoryToken');

export interface CognitoRepositoryInterface {
  createUser(
    username: string,
    temporaryPassword: string,
    email: string,
    role: string
  ): Promise<CognitoUserType>;
  authenticateUser(
    username: string,
    password: string
  ): Promise<AdminInitiateAuthCommandOutput>;
  changePassword(
    username: string,
    newPassword: string,
    session: string
  ): Promise<AdminRespondToAuthChallengeCommandOutput>;
  forgotPassword(username: string): Promise<ForgotPasswordCommandOutput>;
  confirmForgotPassword(
    username: string,
    code: string,
    newPassword: string
  ): Promise<ConfirmForgotPasswordCommandOutput>;
  getUserProfile(username: string): Promise<AdminGetUserCommandOutput>;
}
