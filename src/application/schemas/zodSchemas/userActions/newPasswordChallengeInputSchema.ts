import { z } from 'zod';

export const newPasswordChallengeInputSchema = z.object({
  username: z.string(),
  newPassword: z.string().min(8, 'Password debe ser de al menos 8 caracteres'),
  session: z.string(),
});
