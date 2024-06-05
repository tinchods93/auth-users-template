import { z } from 'zod';
import { UserServiceChangePasswordInputType } from '../../services/types/userServiceTypes';

export const newPasswordChallengeInputSchema =
  z.custom<UserServiceChangePasswordInputType>();
