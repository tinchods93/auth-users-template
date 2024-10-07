import { z } from 'zod';

export const validateSessionTokenInputSchema = z.object({
  token: z.string(),
});
