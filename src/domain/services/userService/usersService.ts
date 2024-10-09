import { inject, injectable } from 'tsyringe';
import { merge } from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { AdminRespondToAuthChallengeCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import {
  COGNITO_REPOSITORY_TOKEN,
  CognitoRepositoryInterface,
} from '../../../infrastructure/secondary/repository/interfaces/cognitoServiceInterface';
import { UsersServiceInterface } from './interfaces/usersServiceInterface';
import { CognitoAuthenticationResponseType } from '../../../infrastructure/secondary/repository/types/cognitoServiceTypes';
import {
  UserServiceChangePasswordInputType,
  UserServiceConfirmForgotPasswordInputType,
  UserServiceForgotPasswordInputType,
  UserServiceLoginInputType,
  UserServiceRegisterInputType,
  UsersServiceGetUserInputType,
  UsersServiceUpdateUserInputType,
  UsersServiceValidateSessionTokenInputType,
} from './types/userServiceTypes';
import { RolesEnum } from '../../../domain/enums/rolesEnum';
import {
  USER_ENTITY_TOKEN,
  UserEntityInterface,
} from '../../../domain/entities/userEntity/interface/userEntityInterface';
import {
  UserEntityTableItem,
  UserPublicData,
} from '../../../domain/entities/userEntity/types/userTypes';
import { EntitiesEnum } from '../../../domain/enums/entitiesEnum';
import { TableGsiEnum } from '../../enums/userTableGsi';
import {
  TABLE_REPOSITORY_TOKEN,
  TableRepositoryInterface,
} from '../../../infrastructure/secondary/repository/interfaces/tableRepositoryInterface';
import { TableServiceInterface } from '../../../infrastructure/secondary/services/interface/tableServiceInterface';
import { ErrorCodesEnum } from '../../../commons/errors/enums/errorCodesEnum';
import { ErrorMessagesEnum } from '../../../commons/errors/enums/errorMessagesEnum';
import UserServiceException from '../errors/userServiceException';
import StandaloneLicenseServiceInterface, {
  STANDALONE_LICENSE_SERVICE_TOKEN,
} from '../licenseService/interfaces/LicenseServiceAloneInterface';

const tableName = process.env.USERS_LICENSES_TABLE_NAME as string;

/**
 * Clase UsersService que implementa la interfaz UsersServiceInterface.
 * Esta clase se utiliza para gestionar las operaciones de los usuarios.
 */
@injectable()
export default class UsersService implements UsersServiceInterface {
  private tableService: TableServiceInterface;

  constructor(
    @inject(COGNITO_REPOSITORY_TOKEN)
    private cognitoRepository: CognitoRepositoryInterface,
    @inject(TABLE_REPOSITORY_TOKEN)
    private tableRepository: TableRepositoryInterface,
    @inject(USER_ENTITY_TOKEN) private userEntity: UserEntityInterface,
    @inject(STANDALONE_LICENSE_SERVICE_TOKEN)
    private licenseStandaloneService: StandaloneLicenseServiceInterface
  ) {
    this.tableService = this.tableRepository.getInstance(
      this.userEntity.getTableSchema(),
      tableName
    );
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
        throw new Error(ErrorMessagesEnum.COGNITO_USER_SUB_NOT_FOUND);
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
      throw UserServiceException.handle({
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
      throw UserServiceException.handle({
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
      throw UserServiceException.handle({
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
  ): Promise<any> {
    try {
      const { username } = payload;

      const response = await this.cognitoRepository.forgotPassword(username);

      return {
        ...response,
        status: 'success',
      };
    } catch (error) {
      throw UserServiceException.handle({
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
  ): Promise<any> {
    try {
      const { username, newPassword, confirmationCode } = payload;
      const response = await this.cognitoRepository.confirmForgotPassword(
        username,
        confirmationCode,
        newPassword
      );

      return {
        ...response,
        status: 'success',
      };
    } catch (error) {
      throw UserServiceException.handle({
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
    payload?: UsersServiceGetUserInputType,
    returnRaw?: boolean
  ): Promise<
    | UserEntityTableItem
    | UserPublicData
    | UserEntityTableItem[]
    | UserPublicData[]
  > {
    try {
      let query: any = {
        type: {
          eq: EntitiesEnum.USER,
        },
      };

      if (payload?.user_id) {
        query = {
          ...query,
          user_id: {
            eq: payload.user_id,
          },
        };
      }

      const response = await this.tableService.query({
        query,
        options: {
          using_index: TableGsiEnum.TYPE,
        },
      });

      if (!response?.length) {
        throw new Error(ErrorMessagesEnum.USER_NOT_FOUND);
      }

      if (payload?.user_id) {
        const [user] = response;

        if (user.license_id) {
          const license = await this.licenseStandaloneService.getLicense({
            licenseId: user.license_id,
          });
          user.license = license;
        }

        if (returnRaw) {
          return user as UserEntityTableItem;
        }

        return this.userEntity.getClean(user);
      }

      const users = await Promise.allSettled(
        response.map(async (user) => {
          if (user.license_id) {
            const license = await this.licenseStandaloneService.getLicense({
              licenseId: user.license_id,
            });
            user.license = license;
          }

          if (returnRaw) {
            return user as UserEntityTableItem;
          }

          return this.userEntity.getClean(user);
        })
      ).then((fulfilled) =>
        fulfilled.filter((p) => p.status === 'fulfilled').map((p) => p.value)
      );

      return users;
    } catch (error) {
      throw UserServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.USER_GET_FAILED,
        status: error.status ?? StatusCodes.CONFLICT,
        payload,
        error,
      });
    }
  }

  async getAllUsersProfile(
    returnRaw?: boolean
  ): Promise<UserEntityTableItem[] | UserPublicData[]> {
    try {
      const response = await this.tableService.query({
        query: {
          type: {
            eq: EntitiesEnum.USER,
          },
        },
        options: {
          using_index: TableGsiEnum.TYPE,
        },
      });

      if (!response?.length) {
        throw new Error(ErrorMessagesEnum.USER_NOT_FOUND);
      }

      const users = await Promise.all(
        response.map(async (user) => {
          if (user.license_id) {
            const license = await this.licenseStandaloneService.getLicense({
              licenseId: user.license_id,
            });
            user.license = license;
          }
          if (returnRaw) {
            return user as UserEntityTableItem;
          }

          return this.userEntity.getClean(user);
        })
      );

      return users;
    } catch (error) {
      throw UserServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.USER_GET_FAILED,
        status: error.status ?? StatusCodes.CONFLICT,
        error,
      });
    }
  }

  async updateUserProfile(
    payload: UsersServiceUpdateUserInputType
  ): Promise<UserPublicData> {
    console.log('MARTIN_LOG=> updateUserProfile -> payload', payload);
    try {
      const { user_id: userId, ...payloadForUpdate } = payload;

      const existingUser = (await this.getUserProfile(
        {
          user_id: userId,
        },
        true
      )) as UserEntityTableItem;

      if (!existingUser) {
        throw new Error(ErrorMessagesEnum.USER_NOT_FOUND);
      }

      const {
        pk,
        sk,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        user_id: existingUserId,
        ...existingPayload
      } = existingUser;

      console.log(
        'MARTIN_LOG=> updateUserProfile -> existingUser',
        existingUser
      );
      const newPayload = merge(
        JSON.parse(JSON.stringify(existingPayload)),
        payloadForUpdate
      );

      if (payload.role) {
        newPayload.role = newPayload.role?.toLowerCase();
        console.log('MARTIN_LOG=> updateUserProfile -> newPayload', {
          existingPayload,
          newPayload,
        });

        const res = await Promise.allSettled([
          this.cognitoRepository.addUserToGroup(
            newPayload.username,
            RolesEnum[newPayload.role.toUpperCase()]
          ),
          this.cognitoRepository.removeUserFromGroup(
            existingPayload.username,
            RolesEnum[existingPayload.role.toUpperCase()]
          ),
          this.cognitoRepository.updateCustomAttribute(
            newPayload.username,
            'role',
            newPayload.role
          ),
        ]).catch((error) => {
          throw new Error(
            `${ErrorCodesEnum.USER_UPDATE_FAILED}. ${error.message}`
          );
        });

        console.log('MARTIN_LOG=> updateUserProfile -> res', res);
      }
      const response = await this.tableService.update({
        key: {
          pk,
          sk,
        },
        payload: newPayload,
      });

      return this.userEntity.getClean(response);
    } catch (error) {
      throw UserServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.USER_UPDATE_FAILED,
        status: error.status ?? StatusCodes.CONFLICT,
        payload,
        error,
      });
    }
  }

  async validateSessionToken({
    token,
  }: UsersServiceValidateSessionTokenInputType): Promise<any> {
    try {
      const response = await this.cognitoRepository.validateSessionToken(token);
      return {
        sub: response?.sub,
        'cognito:groups': response?.['cognito:groups'],
        email_verified: response?.email_verified,
        'cognito:username': response?.['cognito:username'],
        'cognito:roles': response?.['cognito:roles'],
        exp: response?.exp,
        'custom:role': response?.['custom:role'],
        email: response?.email,
      };
    } catch (error) {
      throw UserServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.USER_VERIFY_SESSION_TOKEN,
        status: error.status ?? StatusCodes.UNAUTHORIZED,
        payload: { token },
        error,
      });
    }
  }
}
