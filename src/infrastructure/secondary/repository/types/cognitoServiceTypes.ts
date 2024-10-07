import { UserType } from '@aws-sdk/client-cognito-identity-provider';

export type CognitoAuthenticationResponseType = {
  accessToken?: string;
  refreshToken?: string;
  challengeName?: string;
  challengeParameters?: object;
  session?: string;
};

export type CognitoUserType = UserType;

export type DecodedCognitoToken = {
  header: {
    kid: string;
    alg: string;
  };
  payload: {
    sub: string;
    'cognito:groups': string[];
    email_verified: boolean;
    iss: string;
    'cognito:username': string;
    origin_jti: string;
    'cognito:roles': string[];
    aud: string;
    event_id: string;
    token_use: string;
    auth_time: number;
    exp: number;
    'custom:role': string;
    iat: number;
    jti: string;
    email: string;
  };
  signature: string;
};
