import { UserEntityConstructorType } from '../../src/domain/entities/userEntity/types/userTypes';

export const UserEntityCompleteMock: UserEntityConstructorType = {
  username: 'testuser',
  email: 'testuser@example.com',
  personal_data: {
    name: 'Test',
    last_name: 'User',
    address: '123 Test St',
    dni: '12345678',
    phone_number: '1234567890',
    birth_date: '1990-01-01',
  },
  office_data: {
    office_id: 'office123',
    name: 'Test Office',
    address: '456 Office St',
    cuit: '20-12345678-9',
    phone_number: '0987654321',
    email: 'office@example.com',
  },
  parent_id: 'parent123',
  user_id: 'user123',
};
