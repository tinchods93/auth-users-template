import { z } from 'zod';

export const renewLicenseActionInputSchema = z.object({
  inputLicenseId: z.string(),
  durationInMonths: z.number(),
});
