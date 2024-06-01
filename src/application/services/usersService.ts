import { inject, injectable } from 'tsyringe';
import { UserType } from '../../domain/types/userTypes';
import {
  COGNITO_REPOSITORY_TOKEN,
  CognitoRepositoryInterface,
} from '../../infrastructure/secondary/repository/interfaces/cognitoServiceInterface';
import { UsersServiceInterface } from './interfaces/usersServiceInterface';
import { CognitoAuthenticationResponseType } from '../../infrastructure/secondary/repository/types/cognitoServiceTypes';

@injectable()
export default class UsersService implements UsersServiceInterface {
  constructor(
    @inject(COGNITO_REPOSITORY_TOKEN)
    private cognitoRepository: CognitoRepositoryInterface
  ) {
    console.log('MARTIN_LOG=> UsersService=>constructor=> ', this);
  }

  async create(user: UserType): Promise<any> {
    const { username, temporaryPassword, email } = user;

    return this.cognitoRepository.createUser(
      username,
      temporaryPassword,
      email,
      user.role ?? 'user'
    );
  }

  async authenticate(payload: {
    username: string;
    password: string;
  }): Promise<CognitoAuthenticationResponseType> {
    const { username, password } = payload;
    const response = await this.cognitoRepository.authenticateUser(
      username,
      password
    );

    if (response.AuthenticationResult) {
      return {
        accessToken: response.AuthenticationResult?.AccessToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
      };
    }

    return {
      challengeName: response.ChallengeName,
      challengeParameters: response.ChallengeParameters,
      session: response.Session,
    };
  }

  async changePassword(payload: {
    username: string;
    newPassword: string;
    session: string;
  }): Promise<any> {
    const { username, newPassword, session } = payload;
    const response = await this.cognitoRepository.changePassword(
      username,
      newPassword,
      session
    );

    if (response.AuthenticationResult) {
      return {
        accessToken: response.AuthenticationResult?.AccessToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
      };
    }

    return response;
  }

  async forgotPassword(payload: { username: string }): Promise<any> {
    const { username } = payload;

    const response = await this.cognitoRepository.forgotPassword(username);

    return response;
  }

  async confirmForgotPassword(payload: {
    username: string;
    newPassword: string;
    confirmationCode: string;
  }): Promise<any> {
    const { username, newPassword, confirmationCode } = payload;
    const response = await this.cognitoRepository.confirmForgotPassword(
      username,
      newPassword,
      confirmationCode
    );

    return response;
  }
}
