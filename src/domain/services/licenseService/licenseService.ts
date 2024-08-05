import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import {
  USERS_SERVICE_TOKEN,
  UsersServiceInterface,
} from '../userService/interfaces/usersServiceInterface';
import { TableServiceInterface } from '../../../infrastructure/secondary/services/interface/tableServiceInterface';
import {
  TABLE_REPOSITORY_TOKEN,
  TableRepositoryInterface,
} from '../../../infrastructure/secondary/repository/interfaces/tableRepositoryInterface';
import {
  LICENSE_HISTORY_ENTITY_TOKEN,
  LicenseHistoryEntityInterface,
} from '../../entities/license/licenseHistory/interfaces/licenseHistoryEntityInterface';
import { LicenseHistoryEntityTableItemType } from '../../entities/license/licenseHistory/types/licenseHistoryEntityTypes';
import { EntitiesEnum } from '../../enums/entitiesEnum';
import { TableGsiEnum } from '../../enums/userTableGsi';
import LicenseServiceException from '../errors/licenseServiceException';
import { ErrorCodesEnum } from '../../../commons/errors/enums/errorCodesEnum';
import { ErrorMessagesEnum } from '../../../commons/errors/enums/errorMessagesEnum';
import {
  LICENSE_ENTITY_TOKEN,
  LicenseEntityInterface,
} from '../../entities/license/licenseEntity/interface/licenseEntityInterface';
import { LicenseStatusEnum } from '../../entities/license/licenseEntity/enum/licensesEnum';
import { LicenseHistoryActionsEnum } from '../../entities/license/licenseHistory/enums/licenseHistoryEnums';
import {
  LicenseEntityData,
  LicenseEntityTableItemType,
} from '../../entities/license/licenseEntity/types/licenseTypes';
import LicenseServiceInterface from './interfaces/LicenseServiceInterface';
import {
  AddLicenseToUserParams,
  GetLicenseByIdParams,
  GetLicenseByUserParams,
  RenewLicenseParams,
  RevokeLicenseParams,
} from './types/licenseServiceTypes';

const tableName = process.env.USERS_LICENSES_TABLE_NAME as string;

@injectable()
export default class LicenseService implements LicenseServiceInterface {
  private tableService: TableServiceInterface;

  constructor(
    @inject(USERS_SERVICE_TOKEN) private userService: UsersServiceInterface,
    @inject(TABLE_REPOSITORY_TOKEN)
    private tableRepository: TableRepositoryInterface,
    @inject(LICENSE_ENTITY_TOKEN)
    private LicenseEntity: LicenseEntityInterface,
    @inject(LICENSE_HISTORY_ENTITY_TOKEN)
    private licenseHistory: LicenseHistoryEntityInterface
  ) {
    this.tableService = this.tableRepository.getInstance(
      this.licenseHistory.getTableSchema(),
      tableName
    );
  }

  /**
   * Añade una licencia a un usuario
   * @param {AddLicenseToUserParams} params - Parámetros para añadir la licencia
   * @returns {Promise<any>} - Retorna una promesa que resuelve a cualquier valor
   */
  async addLicenseToUser(params: AddLicenseToUserParams): Promise<any> {
    try {
      const { userId, licenseType, durationInMonths } = params;

      // Verificar que el usuario existe
      const user = await this.userService.getUserProfile(
        { user_id: userId },
        true
      );

      if (!user) {
        throw new Error(ErrorMessagesEnum.USER_NOT_FOUND);
      }
      // Verificar que el usuario no tenga una licencia activa
      const userLicense = await this.getLicenseByUser({ userId }).catch(
        () => null
      );
      if (userLicense) {
        throw new Error(
          `${ErrorMessagesEnum.LICENSE_ALREADY_EXISTS}. license_id: ${userLicense.license_id}`
        );
      }
      // Crear la licencia
      const licenseEntity = this.LicenseEntity.build({
        license_type: licenseType,
        duration_in_Months: durationInMonths,
        user_id: user.user_id,
      });

      // Crear la licenseHistory
      const licenseHistoryEntity = this.licenseHistory.build({
        license_id: licenseEntity.license_id,
        user_id: user.user_id,
        license_history_data: {
          action: LicenseHistoryActionsEnum.CREATE,
          action_changes: licenseEntity,
          action_user_pk: user.user_id,
        },
      });

      const promises = [
        // Guardar la licencia en la tabla
        this.tableService.create(licenseEntity),
        // Guardar la licenseHistory en la tabla
        this.tableService.create(licenseHistoryEntity),
        // Asociar la licencia al usuario
        this.userService.updateUserProfile({
          user_id: user.user_id,
          license_id: licenseEntity.license_id,
        }),
      ];

      await Promise.all(promises);

      // Retornar la licencia
      return this.LicenseEntity.getClean(licenseEntity);
    } catch (error) {
      throw LicenseServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.LICENSE_ADD_FAILED,
        status: error.status ?? StatusCodes.CONFLICT,
        error,
      });
    }
  }

  /**
   * Obtiene la licencia de un usuario
   * @param {GetLicenseByUserParams} params - Parámetros para obtener la licencia
   * @returns {Promise<LicenseHistoryEntityTableItemType>} - Retorna una promesa que resuelve a un elemento de la tabla de historial de licencias
   */
  async getLicenseByUser(
    params: GetLicenseByUserParams
  ): Promise<LicenseHistoryEntityTableItemType> {
    try {
      const { userId } = params;
      const licenseItem = await this.tableService.query({
        query: {
          type: {
            eq: EntitiesEnum.LICENSE,
          },
          user_id: {
            eq: userId,
          },
        },
        options: {
          using_index: TableGsiEnum.TYPE,
        },
      });

      if (!licenseItem?.length) {
        throw new Error(ErrorMessagesEnum.LICENSE_NOT_FOUND);
      }

      return licenseItem[0];
    } catch (error) {
      throw LicenseServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.LICENSE_GET_FAILED,
      });
    }
  }

  /**
   * Obtiene una licencia por su ID
   * @param {GetLicenseByIdParams} params - Parámetros para obtener la licencia
   * @returns {Promise<LicenseEntityTableItemType>} - Retorna una promesa que resuelve a un elemento de la tabla de licencias
   */
  async getLicenseById(
    params: GetLicenseByIdParams
  ): Promise<LicenseEntityTableItemType> {
    try {
      const { licenseId } = params;
      const licenseItem = await this.tableService.query({
        query: {
          type: {
            eq: EntitiesEnum.LICENSE,
          },
          license_id: {
            eq: licenseId,
          },
        },
        options: {
          using_index: TableGsiEnum.TYPE,
        },
      });

      if (!licenseItem?.length) {
        throw new Error(ErrorMessagesEnum.LICENSE_NOT_FOUND);
      }

      return licenseItem[0];
    } catch (error) {
      throw LicenseServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.LICENSE_GET_FAILED,
      });
    }
  }

  /**
   * Renueva una licencia
   * @param {RenewLicenseParams} params - Parámetros para renovar la licencia
   * @returns {Promise<LicenseEntityData>} - Retorna una promesa que resuelve a los datos de una licencia
   */
  async renewLicense(params: RenewLicenseParams): Promise<LicenseEntityData> {
    try {
      const { inputLicenseId, durationInMonths } = params;
      // Obtenemos la licencia
      const license = await this.getLicenseById({ licenseId: inputLicenseId });
      if (!license) {
        throw new Error(ErrorMessagesEnum.LICENSE_NOT_FOUND);
      }

      // Actualizamos la fecha de expiración
      const {
        pk,
        sk,
        license_id: licenseId,
        user_id: userId,
        ...updatedLicense
      } = this.LicenseEntity.updateExpirationDate(license, durationInMonths);

      // creamos la licenseHistory para esta accion
      const licenseHistoryEntity = this.licenseHistory.build({
        license_id: licenseId,
        user_id: userId,
        license_history_data: {
          action: LicenseHistoryActionsEnum.RENEW,
          action_changes: {
            durationInMonths,
          },
          action_user_pk: userId, // TODO: Cambiar por el usuario que realiza la acción
        },
      });

      // Actualizamos los objetos en la tabla
      const promises = [
        this.tableService.update({ key: { pk, sk }, payload: updatedLicense }),
        this.tableService.create(licenseHistoryEntity),
      ];
      await Promise.all(promises);

      return this.LicenseEntity.getClean(license);
    } catch (error) {
      throw LicenseServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.LICENSE_RENEW_FAILED,
      });
    }
  }

  /**
   * Revoca una licencia
   * @param {RevokeLicenseParams} params - Parámetros para revocar la licencia
   * @returns {Promise<LicenseEntityData>} - Retorna una promesa que resuelve a los datos de una licencia
   */
  async revokeLicense(params: RevokeLicenseParams): Promise<LicenseEntityData> {
    try {
      const { licenseId } = params;
      // Obtenemos la licencia
      const license = await this.getLicenseById({ licenseId });
      if (!license) {
        throw new Error(ErrorMessagesEnum.LICENSE_NOT_FOUND);
      }

      // Actualizamos la licencia
      const {
        pk,
        sk,
        license_id: updatedLicenseId,
        user_id: userId,
        ...updatedLicense
      } = license;

      updatedLicense.license_data.status = LicenseStatusEnum.REVOKED;

      // TODO: Separar la logica de licenseHistory en otro servicio
      // creamos la licenseHistory para esta accion
      const licenseHistoryEntity = this.licenseHistory.build({
        license_id: updatedLicenseId,
        user_id: userId,
        license_history_data: {
          action: LicenseHistoryActionsEnum.REVOKE,
          action_changes: updatedLicense,
          action_user_pk: userId, // TODO: Cambiar por el usuario que realiza la acción
        },
      });

      // Actualizamos los objetos en la tabla
      const promises = [
        this.tableService.update({ key: { pk, sk }, payload: updatedLicense }),
        this.tableService.create(licenseHistoryEntity),
      ];
      await Promise.all(promises);

      return this.LicenseEntity.getClean(license);
    } catch (error) {
      throw LicenseServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.LICENSE_REVOKE_FAILED,
      });
    }
  }
}
