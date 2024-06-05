import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import { EntitiesEnum } from '../../enums/entitiesEnum';
import { LicenseStatusEnum, LicenseTypeEnum } from './enum/licensesEnum';
import { LicenseEntityInterface } from './interface/licenseEntityInterface';
import {
  LicenseConstructor,
  LicenseTableItemType,
  LicenseType,
} from './types/licenseTypes';
import { licenseConfig } from './configs/licensesConfig';

export default class LicenseEntity implements LicenseEntityInterface {
  private pk!: string;

  private sk!: string;

  private type!: EntitiesEnum.LICENSE;

  private license_id!: string;

  private license_data!: LicenseType;

  private user_id: string;

  private license_type: LicenseTypeEnum;

  data!: LicenseTableItemType;

  constructor(input: LicenseConstructor) {
    this.user_id = input.user_id;
    this.license_type = input.license_type;
    this.build();
  }

  build() {
    this.license_id = randomUUID();
    this.pk = `${this.type}#${this.license_id}`;
    this.sk = `${this.type}#${this.license_id}`;
    this.buildLicenseData();
    this.data = {
      pk: this.pk,
      sk: this.sk,
      type: this.type,
      license_id: this.license_id,
      license_data: this.license_data,
      user_id: this.user_id,
    };
  }

  buildLicenseData() {
    const licenseConfigData = licenseConfig[this.license_type];

    this.license_data = {
      license_type: this.license_type,
      status: LicenseStatusEnum.ACTIVE,
      limits: licenseConfigData.limits,
      creation_date: dayjs().unix(),
      expiration_date: dayjs().add(1, 'month').unix(),
    };
  }
}
