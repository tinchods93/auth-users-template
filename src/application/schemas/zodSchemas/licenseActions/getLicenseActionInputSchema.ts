import { z } from 'zod';

export const getLicenseActionInputSchema = z.object({
  license_id: z.string().optional(),
  user_id: z.string().optional(),
});
