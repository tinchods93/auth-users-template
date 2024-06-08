// import container from tsyringe and declare all dependencies for injection

import { container as depsContainer } from 'tsyringe';
import {
  COGNITO_REPOSITORY_TOKEN,
  CognitoRepositoryInterface,
} from './infrastructure/secondary/repository/interfaces/cognitoServiceInterface';
import CognitoRepository from './infrastructure/secondary/repository/cognitoService';
import {
  USERS_SERVICE_TOKEN,
  UsersServiceInterface,
} from './application/services/interfaces/usersServiceInterface';
import UsersService from './application/services/usersService';
import {
  USER_ENTITY_TOKEN,
  UserEntityInterface,
} from './domain/entities/user/interface/userEntityInterface';
import {
  LICENSE_ENTITY_TOKEN,
  LicenseEntityInterface,
} from './domain/entities/license/interface/licenseEntityInterface';
import LicenseEntity from './domain/entities/license/licenseEntity';
import UserEntity from './domain/entities/user/userEntity';
import {
  TABLE_REPOSITORY_TOKEN,
  TableRepositoryInterface,
} from './infrastructure/secondary/repository/interfaces/tableRepositoryInterface';
import TableRepository from './infrastructure/secondary/repository/tableRepository';
import TableService from './infrastructure/secondary/services/tableService';
import {
  TABLE_SERVICE_TOKEN,
  TableServiceInterface,
} from './infrastructure/secondary/services/interface/tableServiceInterface';

// application
depsContainer.register<UsersServiceInterface>(USERS_SERVICE_TOKEN, {
  useClass: UsersService,
});

// domain
depsContainer.register<LicenseEntityInterface>(LICENSE_ENTITY_TOKEN, {
  useClass: LicenseEntity,
});
depsContainer.register<UserEntityInterface>(USER_ENTITY_TOKEN, {
  useClass: UserEntity,
});

// infrastructure
depsContainer.register<CognitoRepositoryInterface>(COGNITO_REPOSITORY_TOKEN, {
  useClass: CognitoRepository,
});
depsContainer.register<TableServiceInterface>(TABLE_SERVICE_TOKEN, {
  useClass: TableService,
});
depsContainer.register<TableRepositoryInterface>(TABLE_REPOSITORY_TOKEN, {
  useClass: TableRepository,
});

export default depsContainer;
