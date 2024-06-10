import {
  LicenseEntityData,
  LicenseEntityTableItemType,
} from '../../../entities/license/licenseEntity/types/licenseTypes';
import { LicenseHistoryEntityTableItemType } from '../../../entities/license/licenseHistory/types/licenseHistoryEntityTypes';
import {
  AddLicenseToUserParams,
  GetLicenseByIdParams,
  GetLicenseByUserParams,
  RenewLicenseParams,
  RevokeLicenseParams,
} from '../types/licenseServiceTypes';

export const LICENSE_SERVICE_TOKEN = Symbol('LicenseServiceToken');

interface LicenseServiceInterface {
  addLicenseToUser(params: AddLicenseToUserParams): Promise<any>;
  getLicenseByUser(
    params: GetLicenseByUserParams
  ): Promise<LicenseHistoryEntityTableItemType>;
  getLicenseById(
    params: GetLicenseByIdParams
  ): Promise<LicenseEntityTableItemType>;
  renewLicense(params: RenewLicenseParams): Promise<LicenseEntityData>;
  revokeLicense(params: RevokeLicenseParams): Promise<LicenseEntityData>;
}

export default LicenseServiceInterface;
