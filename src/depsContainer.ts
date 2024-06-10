// import container from tsyringe and declare all dependencies for injection

import { container as depsContainer } from 'tsyringe';
import {
  COGNITO_REPOSITORY_TOKEN,
  CognitoRepositoryInterface,
} from './infrastructure/secondary/repository/interfaces/cognitoServiceInterface';
import CognitoRepository from './infrastructure/secondary/repository/cognitoService';
import {
  USER_ENTITY_TOKEN,
  UserEntityInterface,
} from './domain/entities/userEntity/interface/userEntityInterface';
import {
  LICENSE_ENTITY_TOKEN,
  LicenseEntityInterface,
} from './domain/entities/license/licenseEntity/interface/licenseEntityInterface';
import LicenseEntity from './domain/entities/license/licenseEntity/licenseEntity';
import UserEntity from './domain/entities/userEntity/userEntity';
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
import {
  USERS_SERVICE_TOKEN,
  UsersServiceInterface,
} from './domain/services/userService/interfaces/usersServiceInterface';
import UsersService from './domain/services/userService/usersService';
import {
  LICENSE_HISTORY_ENTITY_TOKEN,
  LicenseHistoryEntityInterface,
} from './domain/entities/license/licenseHistory/interfaces/licenseHistoryEntityInterface';
import LicenseHistoryEntity from './domain/entities/license/licenseHistory/licenseHistoryEntity';
import LicenseServiceInterface, {
  LICENSE_SERVICE_TOKEN,
} from './domain/services/licenseService/interfaces/LicenseServiceInterface';
import LicenseService from './domain/services/licenseService/licenseService';

// application

// domain
depsContainer.register<UsersServiceInterface>(USERS_SERVICE_TOKEN, {
  useClass: UsersService,
});
depsContainer.register<LicenseServiceInterface>(LICENSE_SERVICE_TOKEN, {
  useClass: LicenseService,
});
depsContainer.register<LicenseEntityInterface>(LICENSE_ENTITY_TOKEN, {
  useClass: LicenseEntity,
});
depsContainer.register<LicenseHistoryEntityInterface>(
  LICENSE_HISTORY_ENTITY_TOKEN,
  {
    useClass: LicenseHistoryEntity,
  }
);
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
