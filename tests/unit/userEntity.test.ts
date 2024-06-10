import { RolesEnum } from '../../src/domain/enums/rolesEnum';
import UserEntity from '../../src/domain/entities/userEntity/userEntity';
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
    expect(result.username).toBe(input.username);
    expect(result.email).toBe(input.email);
    expect(result.personal_data).toEqual(input.personal_data);
    expect(result.office_data).toEqual(input.office_data);
    expect(result.parent_id).toBe(input.parent_id);
    expect(result.user_id).toBe(input.user_id);
    expect(result.role).toBe(RolesEnum.USER);
    expect(result.pk).toBe(`USER#${input.user_id}`);
    expect(result.sk).toBe(`USER#${input.user_id}`);
    expect(result.creation_date).toBeDefined();
    expect(result.update_date).toBeDefined();
  });

  it('should build a UserEntity with missing optional fields', () => {
    const input = {
      username: 'testuser',
      email: 'testuser@example.com',
      parent_id: 'parent123',
      user_id: 'user123',
    };

    const userEntity = new UserEntity();
    const result = userEntity.build(input);
    outputTestResponse({
      testName: 'UserEntityMissingOptionalFields',
      payload: result,
    });
    expect(result.username).toBe(input.username);
    expect(result.email).toBe(input.email);
    expect(result.personal_data).toBeUndefined();
    expect(result.office_data).toBeUndefined();
    expect(result.parent_id).toBe(input.parent_id);
    expect(result.user_id).toBe(input.user_id);
    expect(result.role).toBe(RolesEnum.USER);
    expect(result.pk).toBe(`USER#${input.user_id}`);
    expect(result.sk).toBe(`USER#${input.user_id}`);
    expect(result.creation_date).toBeDefined();
    expect(result.update_date).toBeDefined();
  });
});
