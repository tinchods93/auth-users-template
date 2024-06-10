import { z } from 'zod';

export const getLicenseByIdActionInputSchema = z.object({
  license_id: z.string(),
});
