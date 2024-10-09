import {
  AddLicenseToUserParams,
  LicenseServiceResponseType,
} from '../types/licenseServiceTypes';

export const LICENSE_SERVICE_TOKEN = Symbol('LicenseServiceToken');

interface LicenseServiceInterface {
  addLicenseToUser(
    params: AddLicenseToUserParams
  ): Promise<LicenseServiceResponseType>;
}

export default LicenseServiceInterface;
