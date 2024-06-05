import { z } from 'zod';
import { UserServiceConfirmForgotPasswordInputType } from '../../services/types/userServiceTypes';

export const confirmForgotPasswordInputSchema =
  z.custom<UserServiceConfirmForgotPasswordInputType>();
