import isValidLayer from '../../src/commons/errors/utils/isValidLayer';

describe('isValidLayer', () => {
  // input matches a valid layer with correct prefix
  it('should return true when input matches a valid layer with correct prefix', () => {
    const input = 'INFRASTRUCTURE#123';
    const result = isValidLayer(input);
    expect(result).toBe(true);
  });

  // input is null or undefined
  it('should return false when input is null or undefined', () => {
    expect(isValidLayer(null)).toBe(false);
    expect(isValidLayer(undefined)).toBe(false);
  });
});
