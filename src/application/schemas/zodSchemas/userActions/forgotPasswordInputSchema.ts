import { z } from 'zod';

export const forgotPasswordInputSchema = z.object({
  username: z.string(),
});
