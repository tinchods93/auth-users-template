import { inject, injectable } from 'tsyringe';
import {
  COGNITO_REPOSITORY_TOKEN,
  CognitoRepositoryInterface,
} from '../../infrastructure/secondary/repository/interfaces/cognitoServiceInterface';
import { UsersServiceInterface } from './interfaces/usersServiceInterface';
import { CognitoAuthenticationResponseType } from '../../infrastructure/secondary/repository/types/cognitoServiceTypes';
import {
  UserServiceChangePasswordInputType,
  UserServiceConfirmForgotPasswordInputType,
  UserServiceForgotPasswordInputType,
  UserServiceLoginInputType,
  UserServiceRegisterInputType,
  UsersServiceGetUserInputType,
} from './types/userServiceTypes';
import { RolesEnum } from '../../domain/enums/rolesEnum';
import {
  USER_ENTITY_TOKEN,
  UserEntityInterface,
} from '../../domain/entities/user/interface/userEntityInterface';
import { UserPublicData } from '../../domain/entities/user/types/userTypes';
import { EntitiesEnum } from '../../domain/enums/entitiesEnum';
import { UserTableGsiEnum } from '../../domain/entities/license/enum/userTableGsi';
import {
  TABLE_REPOSITORY_TOKEN,
  TableRepositoryInterface,
} from '../../infrastructure/secondary/repository/interfaces/tableRepositoryInterface';
import { TableServiceInterface } from '../../infrastructure/secondary/services/interface/tableServiceInterface';

const tableName = process.env.USERS_TABLE_NAME as string;

@injectable()
export default class UsersService implements UsersServiceInterface {
  private tableService: TableServiceInterface;

  constructor(
    @inject(COGNITO_REPOSITORY_TOKEN)
    private cognitoRepository: CognitoRepositoryInterface,
    @inject(TABLE_REPOSITORY_TOKEN)
    private tableRepository: TableRepositoryInterface,
    @inject(USER_ENTITY_TOKEN) private userEntity: UserEntityInterface
  ) {
    console.log('MARTIN_LOG=> UsersService=>constructor=> ', this);
    this.tableService = this.tableRepository.getInstance(
      this.userEntity.getTableSchema(),
      tableName
    );
  }

  async register(user: UserServiceRegisterInputType): Promise<UserPublicData> {
    const { username, temporaryPassword, email, ...userData } = user;

    const cognitoUser = await this.cognitoRepository.createUser(
      username,
      temporaryPassword,
      email,
      RolesEnum.USER
    );
    const cognitoUserSub = cognitoUser.Attributes?.find((a) => a.Name === 'sub')
      ?.Value as string;

    if (!cognitoUserSub) {
      throw new Error('Cognito user sub not found');
    }

    const newUser = this.userEntity.build({
      username,
      email,
      user_id: cognitoUserSub,
      ...userData,
    });

    await this.tableService.create(newUser);

    return this.userEntity.getClean(newUser);
  }

  async login(
    payload: UserServiceLoginInputType
  ): Promise<CognitoAuthenticationResponseType> {
    const { username, password } = payload;
    const response = await this.cognitoRepository.authenticateUser(
      username,
      password
    );

    if (response.AuthenticationResult) {
      return {
        accessToken: response.AuthenticationResult?.IdToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
      };
    }

    return {
      challengeName: response.ChallengeName,
      challengeParameters: response.ChallengeParameters,
      session: response.Session,
    };
  }

  async changePassword(
    payload: UserServiceChangePasswordInputType
  ): Promise<any> {
    const { username, newPassword, session } = payload;
    const response = await this.cognitoRepository.changePassword(
      username,
      newPassword,
      session
    );

    if (response.AuthenticationResult) {
      return {
        accessToken: response.AuthenticationResult?.IdToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
      };
    }

    return response;
  }

  async forgotPassword(
    payload: UserServiceForgotPasswordInputType
  ): Promise<any> {
    const { username } = payload;

    const response = await this.cognitoRepository.forgotPassword(username);

    return response;
  }

  async confirmForgotPassword(
    payload: UserServiceConfirmForgotPasswordInputType
  ): Promise<any> {
    const { username, newPassword, confirmationCode } = payload;
    const response = await this.cognitoRepository.confirmForgotPassword(
      username,
      newPassword,
      confirmationCode
    );

    return response;
  }

  async getUserProfile(payload: UsersServiceGetUserInputType) {
    const { user_id: userId } = payload;
    const user = await this.tableService.query({
      query: {
        type: {
          eq: EntitiesEnum.USER,
          and: {
            user_id: {
              eq: userId,
            },
          },
        },
      },
      options: {
        using_index: UserTableGsiEnum.TYPE,
      },
    })?.[0];

    if (!user) {
      throw new Error('User not found');
    }

    return this.userEntity.getClean(user);
  }
}
