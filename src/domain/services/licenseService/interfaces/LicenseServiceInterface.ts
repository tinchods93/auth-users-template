import {
  LicenseEntityData,
  LicenseEntityTableItemType,
} from '../../../entities/license/licenseEntity/types/licenseTypes';
import {
  AddLicenseToUserParams,
  GetLicenseParams,
  LicenseServiceResponseType,
  RenewLicenseParams,
  RevokeLicenseParams,
} from '../types/licenseServiceTypes';

export const LICENSE_SERVICE_TOKEN = Symbol('LicenseServiceToken');

interface LicenseServiceInterface {
  addLicenseToUser(
    params: AddLicenseToUserParams
  ): Promise<LicenseServiceResponseType>;
  getLicense(
    params: GetLicenseParams
  ): Promise<LicenseEntityData | LicenseEntityTableItemType>;
  renewLicense(params: RenewLicenseParams): Promise<LicenseServiceResponseType>;
  revokeLicense(
    params: RevokeLicenseParams
  ): Promise<LicenseServiceResponseType>;
}

export default LicenseServiceInterface;
