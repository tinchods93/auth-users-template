import { z } from 'zod';

export const zodSchemaMocks = [
  {
    schema: z.object({
      name: z.string(),
      age: z.number(),
    }),
    input: { name: 'John Doe', age: 30 },
  },
  {
    schema: z.object({
      name: z.string(),
      age: z.number(),
      address: z.object({
        street: z.string(),
        city: z.string(),
        address_2: z.object({
          street: z.string(),
          city: z.string(),
        }),
      }),
    }),
    input: {
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        address_2: {
          street: '456 Main St',
        },
      },
    },
    output: {
      message: ['Required -> age', 'Required -> address.address_2.city'],
      status: 400,
      code: 'schema_validation_failed',
      layer: 'APPLICATION#schema_validation_failed',
    },
  },
];
