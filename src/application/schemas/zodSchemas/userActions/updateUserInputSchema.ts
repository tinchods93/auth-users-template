import { z } from 'zod';
import userModifiableDataSchema from './userModifiebleDataSchema';

export const updateUserInputSchema = z.object({
  user_id: z.string(),
  ...userModifiableDataSchema.shape,
});
