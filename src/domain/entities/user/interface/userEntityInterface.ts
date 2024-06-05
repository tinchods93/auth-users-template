import { Schema } from 'dynamoose/dist/Schema';
import {
  UserEntityConstructorType,
  UserEntityTableItem,
  UserPublicData,
} from '../types/userTypes';

export const USER_ENTITY_TOKEN = Symbol('UserEntityInterface');

export interface UserEntityInterface {
  data: UserEntityTableItem;
  build(input: UserEntityConstructorType): UserEntityTableItem;
  getClean(input: UserEntityTableItem): UserPublicData;
  getTableSchema(): Schema;
}
