import { inject, injectable } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';
import {
  AdminRespondToAuthChallengeCommandOutput,
  ConfirmForgotPasswordCommandOutput,
  ForgotPasswordCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
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
import { ErrorHandlerInterface } from '../../commons/errors/interfaces/errorHandlerInterfaces';
import UserServiceException from '../errors/userServiceException';
import { ErrorCodesEnum } from '../../commons/errors/enums/errorCodesEnum';

const tableName = process.env.USERS_TABLE_NAME as string;

/**
 * Clase UsersService que implementa la interfaz UsersServiceInterface.
 * Esta clase se utiliza para gestionar las operaciones de los usuarios.
 */
@injectable()
export default class UsersService implements UsersServiceInterface {
  private tableService: TableServiceInterface;

  private UserServiceException: ErrorHandlerInterface;

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
    this.UserServiceException = new UserServiceException();
  }

  /**
   * Registra un nuevo usuario.
   * @param {UserServiceRegisterInputType} payload - Los datos del usuario a registrar.
   * @returns {Promise<UserPublicData>} - Los datos públicos del usuario registrado.
   * @throws {UserServiceException} - Si ocurre un error durante el registro.
   */
  async register(
    payload: UserServiceRegisterInputType
  ): Promise<UserPublicData> {
    try {
      const { username, temporaryPassword, email, ...userData } = payload;

      const cognitoUser = await this.cognitoRepository.createUser(
        username,
        temporaryPassword,
        email,
        RolesEnum.USER
      );
      const cognitoUserSub = cognitoUser.Attributes?.find(
        (a) => a.Name === 'sub'
      )?.Value as string;

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
    } catch (error) {
      throw this.UserServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.USER_REGISTER_FAILED,
        status: error.status ?? StatusCodes.CONFLICT,
        payload,
        error,
      });
    }
  }

  /**
   * Autentica a un usuario.
   * @param {UserServiceLoginInputType} payload - Los datos de autenticación del usuario.
   * @returns {Promise<CognitoAuthenticationResponseType>} - El resultado de la autenticación.
   * @throws {UserServiceException} - Si ocurre un error durante la autenticación.
   */
  async login(
    payload: UserServiceLoginInputType
  ): Promise<CognitoAuthenticationResponseType> {
    try {
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
    } catch (error) {
      throw this.UserServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.USER_LOGIN_FAILED,
        status: error.status ?? StatusCodes.UNAUTHORIZED,
        payload,
        error,
      });
    }
  }

  /**
   * Cambia la contraseña de un usuario.
   * @param {UserServiceChangePasswordInputType} payload - Los datos para cambiar la contraseña.
   * @returns {Promise<{ accessToken: string | undefined; refreshToken: string | undefined } | AdminRespondToAuthChallengeCommandOutput>} - El resultado del cambio de contraseña.
   * @throws {UserServiceException} - Si ocurre un error durante el cambio de contraseña.
   */
  async changePassword(
    payload: UserServiceChangePasswordInputType
  ): Promise<
    | { accessToken: string | undefined; refreshToken: string | undefined }
    | AdminRespondToAuthChallengeCommandOutput
  > {
    try {
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
    } catch (error) {
      throw this.UserServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.USER_CHANGE_PASSWORD,
        status: error.status ?? StatusCodes.UNAUTHORIZED,
        payload,
        error,
      });
    }
  }

  /**
   * Inicia el proceso de recuperación de contraseña para un usuario.
   * @param {UserServiceForgotPasswordInputType} payload - Los datos para iniciar la recuperación de contraseña.
   * @returns {Promise<ForgotPasswordCommandOutput>} - El resultado del inicio de la recuperación de contraseña.
   * @throws {UserServiceException} - Si ocurre un error durante el inicio de la recuperación de contraseña.
   */
  async forgotPassword(
    payload: UserServiceForgotPasswordInputType
  ): Promise<ForgotPasswordCommandOutput> {
    try {
      const { username } = payload;

      const response = await this.cognitoRepository.forgotPassword(username);

      return response;
    } catch (error) {
      throw this.UserServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.USER_FORGOT_PASSWORD,
        status: error.status ?? StatusCodes.CONFLICT,
        payload,
        error,
      });
    }
  }

  /**
   * Confirma la recuperación de contraseña para un usuario.
   * @param {UserServiceConfirmForgotPasswordInputType} payload - Los datos para confirmar la recuperación de contraseña.
   * @returns {Promise<ConfirmForgotPasswordCommandOutput>} - El resultado de la confirmación de la recuperación de contraseña.
   * @throws {UserServiceException} - Si ocurre un error durante la confirmación de la recuperación de contraseña.
   */
  async confirmForgotPassword(
    payload: UserServiceConfirmForgotPasswordInputType
  ): Promise<ConfirmForgotPasswordCommandOutput> {
    try {
      const { username, newPassword, confirmationCode } = payload;
      const response = await this.cognitoRepository.confirmForgotPassword(
        username,
        newPassword,
        confirmationCode
      );

      return response;
    } catch (error) {
      throw this.UserServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.USER_CONFIRM_CHANGE_PASSWORD,
        status: error.status ?? StatusCodes.CONFLICT,
        payload,
        error,
      });
    }
  }

  /**
   * Obtiene el perfil de un usuario.
   * @param {UsersServiceGetUserInputType} payload - Los datos para obtener el perfil del usuario.
   * @returns {Promise<UserPublicData>} - Los datos públicos del perfil del usuario.
   * @throws {UserServiceException} - Si ocurre un error al obtener el perfil del usuario.
   */
  async getUserProfile(
    payload: UsersServiceGetUserInputType
  ): Promise<UserPublicData> {
    try {
      const { user_id: userId } = payload;
      const response = await this.tableService.query({
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
      });
      console.log(
        'MARTIN_LOG=> UsersService=>getUserProfile=>user=> ',
        response
      );
      if (!response) {
        throw new Error('User not found');
      }

      const [user] = response;

      return this.userEntity.getClean(user);
    } catch (error) {
      throw this.UserServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.USER_GET_FAILED,
        status: error.status ?? StatusCodes.CONFLICT,
        payload,
        error,
      });
    }
  }
}
