import eachDeep from 'deepdash/eachDeep';
import lodash from 'lodash';

interface Iinput {
  expected: any;
  target: any;
}
interface iOutput {
  output: any;
  missingData?: string[];
  differentTypeData?: string[];
  newData?: string[];
}
enum Eresult {
  'missing' = 'missing',
  'same' = 'same',
  'different_type' = 'different_type',
}
/* eslint-disable default-param-last */

/**
 * @param  {} expected - Object with the right data
 * @param  {} target - Object with the data to test against
 * @param  {} ignore - Array with attributes to be ignored
 */
function compareJsons({ expected, target }: Iinput): iOutput {
  const output: any = {};
  const missingData: any = [];
  const differentTypeData: any = [];
  const newData: any = [];

  eachDeep(expected, (value, key, parentValue, parentKey) => {
    if (typeof value !== 'object' || !Array.isArray(value)) {
      let result: Eresult = Eresult.missing;
      const expectedValue = lodash.get(target, parentKey._item.strPath);
      if (expectedValue !== undefined) {
        if (typeof expectedValue === typeof value) {
          result = Eresult.same;
        } else {
          result = Eresult.different_type;
        }
      }
      if (parentKey._item.strPath) {
        switch (result) {
          case Eresult.missing:
            missingData.push(parentKey._item.strPath);
            break;
          case Eresult.different_type:
            differentTypeData.push(parentKey._item.strPath);
            break;
          default:
            break;
        }
      }

      lodash.set(output, parentKey._item.strPath, result);
    }
  });
  eachDeep(target, (value, key, parentValue, parentKey) => {
    const expectedValue = lodash.get(expected, parentKey._item.strPath);
    if (expectedValue === undefined) {
      newData.push(parentKey._item.strPath);
    }
  });

  delete output.undefined;
  return { output, missingData, differentTypeData, newData };
}

export default compareJsons;
