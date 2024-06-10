import { BasicEntityInterface } from '../../basicEntity/interface/basicEntityInterface';
import {
  UserEntityConstructorType,
  UserEntityTableItem,
  UserPublicData,
} from '../types/userTypes';

export const USER_ENTITY_TOKEN = Symbol('UserEntityInterface');

export interface UserEntityInterface extends BasicEntityInterface {
  data: UserEntityTableItem;
  build(input: UserEntityConstructorType): UserEntityTableItem;
  getClean(input: UserEntityTableItem): UserPublicData;
}
