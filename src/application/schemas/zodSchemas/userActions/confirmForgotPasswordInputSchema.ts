import { z } from 'zod';

export const confirmForgotPasswordInputSchema = z.object({
  username: z.string(),
  newPassword: z.string(),
  confirmationCode: z.string(),
});
