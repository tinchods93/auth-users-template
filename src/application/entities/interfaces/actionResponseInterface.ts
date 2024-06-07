import { ActionResponseInputTypes } from '../types/actionResponseTypes';

export interface ActionResponseInterface {
  success(input: ActionResponseInputTypes): {
    status: number;
    body: any;
  };
  error(input: ActionResponseInputTypes): {
    status: number;
    body: {
      message: string;
      error: any;
    };
  };
}
