import { z } from 'zod';

export const getUserProfileInputSchema = z.object({
  user_id: z.string(),
});
