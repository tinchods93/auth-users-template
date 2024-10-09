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
import LicenseServiceException from '../errors/licenseServiceException';
import { ErrorCodesEnum } from '../../../commons/errors/enums/errorCodesEnum';
import { ErrorMessagesEnum } from '../../../commons/errors/enums/errorMessagesEnum';
import {
  LICENSE_ENTITY_TOKEN,
  LicenseEntityInterface,
} from '../../entities/license/licenseEntity/interface/licenseEntityInterface';
import { LicenseHistoryActionsEnum } from '../../entities/license/licenseHistory/enums/licenseHistoryEnums';
import LicenseServiceInterface from './interfaces/LicenseServiceInterface';
import {
  AddLicenseToUserParams,
  LicenseServiceResponseType,
} from './types/licenseServiceTypes';
import StandaloneLicenseServiceInterface, {
  STANDALONE_LICENSE_SERVICE_TOKEN,
} from './interfaces/LicenseServiceAloneInterface';
import { UserEntityTableItem } from '../../entities/userEntity/types/userTypes';

const tableName = process.env.USERS_LICENSES_TABLE_NAME as string;

@injectable()
export default class LicenseService implements LicenseServiceInterface {
  private tableService: TableServiceInterface;

  constructor(
    @inject(USERS_SERVICE_TOKEN) private userService: UsersServiceInterface,
    @inject(TABLE_REPOSITORY_TOKEN)
    private tableRepository: TableRepositoryInterface,
    @inject(STANDALONE_LICENSE_SERVICE_TOKEN)
    private licenseServiceAlone: StandaloneLicenseServiceInterface,
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
  async addLicenseToUser(
    params: AddLicenseToUserParams
  ): Promise<LicenseServiceResponseType> {
    try {
      const { userId, licenseType, durationInMonths } = params;

      // Verificar que el usuario existe
      const user = (await this.userService.getUserProfile(
        { user_id: userId },
        true
      )) as UserEntityTableItem;

      if (!user) {
        throw new Error(ErrorMessagesEnum.USER_NOT_FOUND);
      }
      // Verificar que el usuario no tenga una licencia activa
      const userLicense = await this.licenseServiceAlone
        .getLicense({ userId }, true)
        .catch(() => null);
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
      return {
        status: 'success',
        data: this.LicenseEntity.getClean(licenseEntity),
      };
    } catch (error) {
      throw LicenseServiceException.handle({
        message: error.message,
        code: ErrorCodesEnum.LICENSE_ADD_FAILED,
        status: error.status ?? StatusCodes.CONFLICT,
        error,
      });
    }
  }
}
