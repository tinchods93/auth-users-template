import dayjs from 'dayjs';
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
    birth_date: dayjs().unix(),
  },
  user_id: 'user123',
};
