import { z } from 'zod';

export const getLicenseByUserActionInputSchema = z.object({
  user_id: z.string(),
});
