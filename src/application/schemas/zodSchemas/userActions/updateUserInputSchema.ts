import { z } from 'zod';
import userModifiableDataSchema from './userModifiebleDataSchema';

export const updateUserInputSchema = z.object({
  user_id: z.string(),
  newPassword: z.string().min(8, 'Password debe ser de al menos 8 caracteres'),
  session: z.string(),
  ...userModifiableDataSchema.shape,
});
