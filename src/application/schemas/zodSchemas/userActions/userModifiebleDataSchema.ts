import { z } from 'zod';

const userModifiableDataSchema = z.object({
  personal_data: z
    .object({
      name: z.string(),
      last_name: z.string(),
      address: z.string(),
      dni: z.string(),
      phone_number: z.string(),
      birth_date: z.string(),
    })
    .optional(),
  office_data: z
    .object({
      office_id: z.string(),
      name: z.string(),
      address: z.string(),
      cuit: z.string(),
      phone_number: z.string(),
      email: z.string(),
    })
    .optional(),
  parent_id: z.string().optional(),
  office_id: z.string().optional(),
  license_id: z.string().optional(),
});

export default userModifiableDataSchema;
