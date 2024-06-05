import Faker from 'fakerator';
import { DateTime } from 'luxon';

const faker = Faker('es-AR');

const buildExampleMock = () => {
  return {
    example_id: faker.misc.uuid(),
    date_created: DateTime.now().toMillis(),
    att_1: {
      sub_att_1: 'string',
      sub_att_2: faker.random.number(1000),
    },
    att_2: {
      sub_att_1: [
        {
          sub_att_1: 'string',
          sub_att_2: faker.random.number(1000),
        },
        {
          sub_att_1: 'string',
          sub_att_2: faker.random.number(1000),
        },
      ],
    },
  };
};

export default buildExampleMock;
