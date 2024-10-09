import {
  LicenseEntityData,
  LicenseEntityTableItemType,
} from '../../../entities/license/licenseEntity/types/licenseTypes';
import {
  GetLicenseParams,
  LicenseServiceResponseType,
  RenewLicenseParams,
  RevokeLicenseParams,
} from '../types/licenseServiceTypes';

export const STANDALONE_LICENSE_SERVICE_TOKEN = Symbol(
  'STANDALONE_LICENSE_SERVICE_TOKEN'
);

interface StandaloneLicenseServiceInterface {
  getLicense(
    params: GetLicenseParams,
    returnRaw?: boolean
  ): Promise<LicenseEntityData | LicenseEntityTableItemType>;
  renewLicense(params: RenewLicenseParams): Promise<LicenseServiceResponseType>;
  revokeLicense(
    params: RevokeLicenseParams
  ): Promise<LicenseServiceResponseType>;
}

export default StandaloneLicenseServiceInterface;
