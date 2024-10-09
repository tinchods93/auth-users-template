import { inject, injectable } from 'tsyringe';
import { TableServiceInterface } from '../../../infrastructure/secondary/services/interface/tableServiceInterface';
import {
  TABLE_REPOSITORY_TOKEN,
  TableRepositoryInterface,
} from '../../../infrastructure/secondary/repository/interfaces/tableRepositoryInterface';
import {
  LICENSE_HISTORY_ENTITY_TOKEN,
  LicenseHistoryEntityInterface,
} from '../../entities/license/licenseHistory/interfaces/licenseHistoryEntityInterface';
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
import {
  GetLicenseParams,
  LicenseServiceResponseType,
  RenewLicenseParams,
  RevokeLicenseParams,
} from './types/licenseServiceTypes';
import StandaloneLicenseServiceInterface from './interfaces/LicenseServiceAloneInterface';

const tableName = process.env.USERS_LICENSES_TABLE_NAME as string;

@injectable()
export default class StandaloneLicenseService
  implements StandaloneLicenseServiceInterface
{
  private tableService: TableServiceInterface;

  constructor(
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
   * Obtiene una licencia por su ID
   * @param {GetLicenseParams} params - Parámetros para obtener la licencia
   * @returns {Promise<LicenseEntityTableItemType>} - Retorna una promesa que resuelve a un elemento de la tabla de licencias
   */
  async getLicense(
    params: GetLicenseParams,
    returnRaw?: boolean
  ): Promise<LicenseEntityData | LicenseEntityTableItemType> {
    try {
      const { licenseId, userId } = params;
      let queryParams = {};
      if (licenseId) {
        queryParams = {
          license_id: {
            eq: licenseId,
          },
        };
      } else if (userId) {
        queryParams = {
          user_id: {
            eq: userId,
          },
        };
      }
      console.log(
        'MARTIN_LOG=> LicenseService -> getLicense -> queryParams',
        JSON.stringify({
          query: {
            type: {
              eq: EntitiesEnum.LICENSE,
            },
            ...queryParams,
          },
          options: {
            using_index: TableGsiEnum.TYPE,
          },
        })
      );
      const licenseItem = await this.tableService.query({
        query: {
          type: {
            eq: EntitiesEnum.LICENSE,
          },
          ...queryParams,
        },
        options: {
          using_index: TableGsiEnum.TYPE,
        },
      });

      if (!licenseItem?.length) {
        throw new Error(ErrorMessagesEnum.LICENSE_NOT_FOUND);
      }

      return returnRaw
        ? licenseItem[0]
        : this.LicenseEntity.getClean(licenseItem[0]);
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
  async renewLicense(
    params: RenewLicenseParams
  ): Promise<LicenseServiceResponseType> {
    try {
      const { licenseId, durationInMonths } = params;
      // Obtenemos la licencia
      const license = (await this.getLicense(
        {
          licenseId,
        },
        true
      )) as LicenseEntityTableItemType;

      if (!license) {
        throw new Error(ErrorMessagesEnum.LICENSE_NOT_FOUND);
      }

      // Actualizamos la fecha de expiración
      const {
        pk,
        sk,
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

      return {
        status: 'success',
        data: this.LicenseEntity.getClean(license),
      };
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
  async revokeLicense(
    params: RevokeLicenseParams
  ): Promise<LicenseServiceResponseType> {
    try {
      const { licenseId } = params;
      // Obtenemos la licencia
      const license = (await this.getLicense(
        {
          licenseId,
        },
        true
      )) as LicenseEntityTableItemType;
      if (!license) {
        throw new Error(ErrorMessagesEnum.LICENSE_NOT_FOUND);
      }
      console.log(
        'MARTIN_LOG=> LicenseService -> revokeLicense -> license',
        JSON.stringify(license)
      );
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

      return {
        status: 'success',
        data: this.LicenseEntity.getClean(license),
      };
    } catch (error) {
      throw LicenseServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.LICENSE_REVOKE_FAILED,
      });
    }
  }
}
