/* eslint-disable prefer-destructuring */
import ZodSchemaValidation from '../../src/application/schemas/ZodSchema';
import outputTestResponse from '../utils/outputTestResponse';
import { zodSchemaMocks } from '../mocks/zodSchemaMocks';

describe('ZodSchemaValidation', () => {
  // validate returns parsed payload when schema is valid
  it('should return parsed payload when schema is valid', () => {
    const { schema, input } = zodSchemaMocks[0];

    const validator = new ZodSchemaValidation(schema);
    const result = validator.validate(input);
    expect(result).toStrictEqual(input);
  });

  // validate throws exception for missing required fields
  it('should throw exception for missing required fields', () => {
    const { schema, input, output } = zodSchemaMocks[1];

    const validator = new ZodSchemaValidation(schema);

    try {
      validator.validate(input);
    } catch (error) {
      outputTestResponse({ testName: 'zodSchemaValidation', payload: error });
      expect(JSON.parse(JSON.stringify(error))).toStrictEqual(output);
    }
  });
});
