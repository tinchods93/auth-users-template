import { z } from 'zod';

export const loginUserInputSchema = z.object({
  username: z.string(),
  password: z.string().min(8, 'Password debe ser de al menos 8 caracteres'),
});
