import { z } from 'zod';
import { UsersServiceGetUserInputType } from '../../services/types/userServiceTypes';

export const getUserProfileInputSchema =
  z.custom<UsersServiceGetUserInputType>();
