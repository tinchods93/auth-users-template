export type CognitoAuthenticationResponseType = {
  accessToken?: string;
  refreshToken?: string;
  challengeName?: string;
  challengeParameters?: object;
  session?: string;
};
