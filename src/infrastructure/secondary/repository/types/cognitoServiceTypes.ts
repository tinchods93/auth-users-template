export type CognitoAuthenticationResponseType = {
  idToken?: string;
  refreshToken?: string;
  accessToken?: string;
  challengeName?: string;
  challengeParameters?: object;
  session?: string;
};
