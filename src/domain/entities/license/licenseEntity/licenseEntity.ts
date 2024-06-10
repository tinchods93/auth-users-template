import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import { EntitiesEnum } from '../../../enums/entitiesEnum';
import { LicenseStatusEnum, LicenseTypeEnum } from './enum/licensesEnum';
import { LicenseEntityInterface } from './interface/licenseEntityInterface';
import {
  LicenseEntityConstructor,
  LicenseEntityData,
  LicenseEntityTableItemType,
  LicenseEntityType,
} from './types/licenseTypes';
import { licenseConfig } from './configs/licensesConfig';
import BasicEntity from '../../basicEntity/basicEntity';

/**
 * Clase de entidad de licencia
 * @class LicenseEntity
 * @extends {BasicEntity}
 * @implements {LicenseEntityInterface}
 */
export default class LicenseEntity
  extends BasicEntity
  implements LicenseEntityInterface
{
  private pk!: string; // LICENSE#license_id

  private sk!: string; // LICENSE#license_id

  private type = EntitiesEnum.LICENSE;

  private license_id!: string;

  private license_data!: LicenseEntityType;

  private user_id!: string;

  private license_type!: LicenseTypeEnum; // STANDARD, PREMIUM

  data!: LicenseEntityTableItemType;

  /**
   * Construye una nueva entidad de licencia
   * @param {LicenseEntityConstructor} input - Los datos de entrada para construir la licencia
   * @returns {LicenseEntityTableItemType} - La licencia construida
   */
  build(input: LicenseEntityConstructor) {
    this.user_id = input.user_id;
    this.license_type = input.license_type ?? LicenseTypeEnum.STANDARD;
    this.license_id = randomUUID();

    const key = `${this.type}#${this.license_id}`;
    this.pk = key;
    this.sk = key;
    this.buildLicenseData(input.duration_in_Months);

    this.data = {
      pk: this.pk,
      sk: this.sk,
      type: this.type,
      license_type: this.license_type,
      license_id: this.license_id,
      license_data: this.license_data,
      user_id: this.user_id,
    };

    return this.data;
  }

  /**
   * Construye los datos de la licencia
   * @param {number} [durationInMonths=1] - La duración de la licencia en meses
   * @private
   */
  private buildLicenseData(durationInMonths = 1) {
    const licenseConfigData = licenseConfig[this.license_type];

    this.license_data = {
      status: LicenseStatusEnum.ACTIVE,
      limits: licenseConfigData.limits,
      creation_date: dayjs().unix(),
      update_date: dayjs().unix(),
      expiration_date: dayjs().add(durationInMonths, 'month').unix(),
    };
  }

  /**
   * Actualiza la fecha de expiración de la licencia
   * @param {LicenseEntityTableItemType} license - La licencia a actualizar
   * @param {number} durationInMonths - La cantidad de meses a añadir a la fecha de expiración
   * @returns {LicenseEntityTableItemType} - La licencia con la fecha de expiración actualizada
   */
  updateExpirationDate(
    license: LicenseEntityTableItemType,
    durationInMonths: number
  ): LicenseEntityTableItemType {
    license.license_data.expiration_date = dayjs()
      .add(durationInMonths, 'month')
      .unix();
    license.license_data.update_date = dayjs().unix();
    return license;
  }

  /**
   * Obtiene una versión limpia de la entidad de licencia
   * @param {LicenseEntityTableItemType} input - La entidad de licencia a limpiar
   * @returns {LicenseEntityData} - La entidad de licencia limpia
   */
  getClean(input: LicenseEntityTableItemType): LicenseEntityData {
    return {
      license_id: input.license_id,
      user_id: input.user_id,
      license_data: input.license_data,
      license_type: input.license_type,
    };
  }
}
