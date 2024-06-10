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

  // Add license to user (crea una nueva licencia en la tabla, tambien una licenseHistory y la asocia al usuario)
  async addLicenseToUser(params: AddLicenseToUserParams): Promise<any> {
    try {
      console.log(
        'MARTIN_LOG=> addLicenseToUser -> params',
        JSON.stringify(params)
      );
      const { userId, licenseType, durationInMonths } = params;
      console.log('MARTIN_LOG=> addLicenseToUser -> destructure', {
        userId,
        licenseType,
        durationInMonths,
      });
      // Verificar que el usuario existe
      const user = await this.userService.getUserProfile(
        { user_id: userId },
        true
      );

      if (!user) {
        throw new Error(ErrorMessagesEnum.USER_NOT_FOUND);
      }
      console.log('MARTIN_LOG=> addLicenseToUser', JSON.stringify(user));
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

  // Get license by user (obtiene la licencia de un usuario)
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

  // Get license by id (obtiene la licencia por id)
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

  // Renew license (actualizamos la fecha de expiración de la licencia y la dejamos en estado ACTIVE)
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

  // Revoke license (desactivamos la licencia dejandola en estado REVOKED)
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
