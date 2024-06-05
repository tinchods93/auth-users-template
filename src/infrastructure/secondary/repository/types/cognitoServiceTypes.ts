import { UserType } from '@aws-sdk/client-cognito-identity-provider';

export type CognitoAuthenticationResponseType = {
  accessToken?: string;
  refreshToken?: string;
  challengeName?: string;
  challengeParameters?: object;
  session?: string;
};

export type CognitoUserType = UserType;
