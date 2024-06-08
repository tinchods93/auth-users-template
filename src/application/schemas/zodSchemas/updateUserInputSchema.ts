import { z } from 'zod';
import { UsersServiceUpdateUserInputType } from '../../services/types/userServiceTypes';

export const updateUserInputSchema =
  z.custom<UsersServiceUpdateUserInputType>();
