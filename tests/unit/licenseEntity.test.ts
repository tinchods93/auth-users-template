import dayjs from 'dayjs';
import {
  LicenseStatusEnum,
  LicenseTypeEnum,
} from '../../src/domain/entities/license/licenseEntity/enum/licensesEnum';
import LicenseEntity from '../../src/domain/entities/license/licenseEntity/licenseEntity';
import outputTestResponse from '../utils/outputTestResponse';

describe('LicenseEntity', () => {
  // Successfully build a LicenseEntity with default STANDARD type
  it('should build a LicenseEntity with default STANDARD type when no license_type is provided', () => {
    const input = { user_id: 'user123' };
    const licenseEntity = new LicenseEntity();
    const result = licenseEntity.build(input);

    outputTestResponse({ testName: 'LicenseEntityStandard', payload: result });

    expect(result.license_type).toBe(LicenseTypeEnum.STANDARD);
    expect(result.user_id).toBe(input.user_id);
    expect(result.license_data.status).toBe(LicenseStatusEnum.ACTIVE);
  });

  // Handle missing duration_in_Months by defaulting to 1 month
  it('should default duration_in_Months to 1 month when not provided', () => {
    const input = { user_id: 'user123' };
    const licenseEntity = new LicenseEntity();
    const result = licenseEntity.build(input);

    const expectedExpirationDate = dayjs().add(1, 'month').unix();
    expect(result.license_data.expiration_date).toBe(expectedExpirationDate);
  });
});
