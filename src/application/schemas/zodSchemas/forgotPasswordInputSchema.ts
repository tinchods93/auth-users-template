import { z } from 'zod';
import { UserServiceForgotPasswordInputType } from '../../services/types/userServiceTypes';

export const forgotPasswordInputSchema =
  z.custom<UserServiceForgotPasswordInputType>();
