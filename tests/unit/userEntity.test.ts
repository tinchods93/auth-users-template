import { EntitiesEnum } from '../../src/domain/enums/entitiesEnum';
import { RolesEnum } from '../../src/domain/enums/rolesEnum';
import UserEntity from '../../src/domain/entities/user/userEntity';
import { UserEntityCompleteMock } from '../mocks/userEntityCompleteMock';
import outputTestResponse from '../utils/outputTestResponse';

describe('Unit Test: UserEntity', () => {
  it('should build a UserEntity with all required fields', () => {
    const input = UserEntityCompleteMock;

    const userEntity = new UserEntity();
    const result = userEntity.build(input);
    outputTestResponse({
      testName: 'UserEntityComplete',
      payload: result,
    });
    expect(result).toEqual({
      pk: 'USER#user123',
      sk: 'USER#user123',
      username: 'testuser',
      email: 'testuser@example.com',
      user_id: 'user123',
      type: EntitiesEnum.USER,
      role: RolesEnum.USER,
      personal_data: input.personal_data,
      office_data: input.office_data,
      office_id: input.office_data?.office_id,
      parent_id: input.parent_id,
      license: input.license,
    });
  });

  it('should build a UserEntity with missing optional fields', () => {
    const input = UserEntityCompleteMock;

    const userEntity = new UserEntity();
    const result = userEntity.build(input);

    expect(result).toEqual({
      pk: 'USER#user123',
      sk: 'USER#user123',
      username: 'testuser',
      email: 'testuser@example.com',
      type: EntitiesEnum.USER,
      user_id: 'user123',
      role: RolesEnum.USER,
      personal_data: input.personal_data,
      office_data: undefined,
      office_id: undefined,
      parent_id: undefined,
      license: undefined,
    });
  });
});
