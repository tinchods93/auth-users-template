import { z } from 'zod';
import { UserServiceLoginInputType } from '../../services/types/userServiceTypes';

export const loginUserInputSchema = z.custom<UserServiceLoginInputType>();
