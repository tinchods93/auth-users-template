import { z } from 'zod';
import { UserServiceRegisterInputType } from '../../services/types/userServiceTypes';

export const registerUserInputSchema = z.custom<UserServiceRegisterInputType>();
