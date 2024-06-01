// import container from tsyringe and declare all dependencies for injection

import { container as diContainer } from 'tsyringe';
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

// application
diContainer.register<UsersServiceInterface>(USERS_SERVICE_TOKEN, {
  useClass: UsersService,
});

// infrastructure
diContainer.register<CognitoRepositoryInterface>(COGNITO_REPOSITORY_TOKEN, {
  useClass: CognitoRepository,
});

export default diContainer;
