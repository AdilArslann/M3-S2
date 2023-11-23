import { expect } from 'vitest';
import { Insertable } from 'kysely';
import { Users } from '@/database';



// Creates a function to create a new user that can be overridden
export const userFactory = (
  overrides: Partial<Insertable<Users>> = {}
): Insertable<Users> => ({
  discordId: '8912798471982',
  ...overrides,
});


export const userFactoryFull = (
  overrides: Partial<Insertable<Users>> = {}
):Insertable<Users> => ({
  id: 2,
  ...userFactory(overrides),
});


// Creates a matcher for the user that checks for all properties
export const userMatcher = (overrides: Partial<Insertable<Users>> = {}) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...userFactory(overrides),
});