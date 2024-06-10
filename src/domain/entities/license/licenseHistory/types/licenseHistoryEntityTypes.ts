import { EntitiesEnum } from '../../../../enums/entitiesEnum';
import { LicenseHistoryActionsEnum } from '../enums/licenseHistoryEnums';

export type licenseHistoryEntityActionType = {
  action: LicenseHistoryActionsEnum;
  action_changes: any; // cuando se va a actualizar la licencia en la tabla, el payload de actualizacion recibido en el request, se guardara en este atributo
  action_user_pk: string; // la pk de quien emitio la accion, puede ser un admin o el mismo usuario
};

export type LicenseHistoryEntityType = {
  user_id: string;
  license_id: string;
  license_history_id: string;
  license_history_data: licenseHistoryEntityActionType;
  creation_date: number;
};

export type LicenseHistoryEntityConstructorInput = Omit<
  LicenseHistoryEntityType,
  'license_history_id' | 'creation_date'
>;
export type LicenseHistoryEntityTableItemType = {
  pk: string; // LICENSE#license_id
  sk: string; // LICENSE_HISTORY#license_history_id
  type: EntitiesEnum.LICENSE_HISTORY;
} & LicenseHistoryEntityType;
