import dayjs from 'dayjs';
import { licenseConfig } from '../../src/domain/entities/license/configs/licensesConfig';
import {
  LicenseTypeEnum,
  LicenseStatusEnum,
} from '../../src/domain/entities/license/enum/licensesEnum';
import { UserEntityConstructorType } from '../../src/domain/entities/user/types/userTypes';

export const UserEntityCompleteMock: UserEntityConstructorType = {
  username: 'testuser',
  email: 'testuser@example.com',
  license: {
    license_type: LicenseTypeEnum.STANDARD,
    status: LicenseStatusEnum.ACTIVE,
    limits: licenseConfig.standard.limits,
    creation_date: dayjs().unix(),
    expiration_date: dayjs().unix(),
  },
  personal_data: {
    name: 'Test',
    last_name: 'User',
    address: '123 Test St',
    dni: '12345678',
    phone_number: '1234567890',
    birth_date: 'dayjs().unix()',
  },
  office_data: {
    office_id: 'office123',
    name: 'Main Office',
    address: '456 Office St',
    cuit: '20-12345678-9',
    phone_number: '0987654321',
    email: 'office@example.com',
  },
  parent_id: 'parent123',
  user_id: 'user123',
};
