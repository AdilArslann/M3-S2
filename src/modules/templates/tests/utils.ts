import { Insertable } from 'kysely';
import { Templates } from '@/database';

export const templateFactory = (
  overrides: Partial<Insertable<Templates>> = {}
): Insertable<Templates> => ({
  content: 'YOU DID IT, YOU SON OF A GUN YOU DID IT!!',
  ...overrides,
});

export const templateFactoryFull = (
  overrides: Partial<Insertable<Templates>> = {}
): Insertable<Templates> => ({
  id: 1,
  ...templateFactory(overrides),
});

export const templateMatcher = (
  overrides: Partial<Insertable<Templates>> = {}
) => ({
  id: expect.any(Number),
  ...overrides,
  ...templateFactory(overrides),
});
