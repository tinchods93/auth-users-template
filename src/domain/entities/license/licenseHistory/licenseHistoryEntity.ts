import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import { EntitiesEnum } from '../../../enums/entitiesEnum';
import {
  LicenseHistoryEntityConstructorInput,
  LicenseHistoryEntityTableItemType,
  LicenseHistoryEntityType,
  licenseHistoryEntityActionType,
} from './types/licenseHistoryEntityTypes';
import BasicEntity from '../../basicEntity/basicEntity';
import { LicenseHistoryEntityInterface } from './interfaces/licenseHistoryEntityInterface';

export default class LicenseHistoryEntity
  extends BasicEntity
  implements LicenseHistoryEntityInterface
{
  private pk!: string; // LICENSE#license_id

  private sk!: string; // LICENSE_HISTORY#license_history_id

  private type = EntitiesEnum.LICENSE_HISTORY;

  private user_id!: string;

  private license_id!: string;

  private license_history_id!: string;

  private license_history_data!: licenseHistoryEntityActionType;

  private creation_date!: number;

  data!: LicenseHistoryEntityTableItemType;

  build(
    input: LicenseHistoryEntityConstructorInput
  ): LicenseHistoryEntityTableItemType {
    this.user_id = input.user_id;
    this.license_id = input.license_id;
    this.license_history_id = randomUUID();
    this.creation_date = dayjs().unix();

    this.pk = `${EntitiesEnum.LICENSE}#${this.license_id}`;
    this.sk = `${EntitiesEnum.LICENSE_HISTORY}#${this.license_history_id}`;

    this.license_history_data = input.license_history_data;

    this.data = {
      pk: this.pk,
      sk: this.sk,
      type: this.type as EntitiesEnum.LICENSE_HISTORY,
      license_id: this.license_id,
      license_history_id: this.license_history_id,
      license_history_data: this.license_history_data,
      creation_date: this.creation_date,
      user_id: this.user_id,
    };

    return this.data;
  }

  getClean(): LicenseHistoryEntityType {
    return {
      license_id: this.license_id,
      license_history_id: this.license_history_id,
      license_history_data: this.license_history_data,
      creation_date: this.creation_date,
      user_id: this.user_id,
    };
  }
}
