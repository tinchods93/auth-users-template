import nock from 'nock';

export const nockRequestExample1 = (url: string) => {
  nock(url).get('').reply(200, {
    status: 'operational',
    description: '',
    name: 'sonqo',
    reason: '',
    type: 'GWAY',
  });
};

export const nockRequestExample2 = (url: string) => {
  nock(url).get('').reply(404, {
    details: 'Could not get entity',
    code: 'ENTITY_NOT_EXISTS',
  });
};
