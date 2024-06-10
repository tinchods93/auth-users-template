import { z } from 'zod';
import userModifiableDataSchema from './userModifiebleDataSchema';

export const registerUserInputSchema = z.object({
  username: z.string(),
  email: z.string().email('Email inválido'),
  temporaryPassword: z
    .string()
    .min(8, 'Password debe ser de al menos 8 caracteres'),
  ...userModifiableDataSchema.shape,
});
