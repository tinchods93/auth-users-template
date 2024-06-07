import { ActionResponseInterface } from './interfaces/actionResponseInterface';
import { ActionResponseInputTypes } from './types/actionResponseTypes';

export default class ActionResponse implements ActionResponseInterface {
  success(input: ActionResponseInputTypes) {
    return {
      status: input.statusCode,
      body: input.data,
    };
  }

  error(input: ActionResponseInputTypes) {
    return {
      status: input.statusCode,
      body: {
        message: input.data.message,
        error: input.data,
      },
    };
  }
}
