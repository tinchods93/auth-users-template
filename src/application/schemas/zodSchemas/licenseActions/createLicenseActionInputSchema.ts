import { z } from 'zod';
import { LicenseTypeEnum } from '../../../../domain/entities/license/licenseEntity/enum/licensesEnum';

export const createLicenseActionInputSchema = z.object({
  userId: z.string(),
  licenseType: z.nativeEnum(LicenseTypeEnum),
  durationInMonths: z.number().optional(),
});
