import { z } from 'zod';

export const renewLicenseActionInputSchema = z.object({
  licenseId: z.string(),
  durationInMonths: z.number(),
});
