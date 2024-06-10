import { z } from 'zod';

export const revokeLicenseActionInputSchema = z.object({
  licenseId: z.string(),
});
