import { expect } from 'vitest';
import { Insertable } from 'kysely';
import { Messages } from '@/database';


export const messageFactory = (
  overrides: Partial<Insertable<Messages>> = {}
): Insertable<Messages> => ({
  userId: 1,
  sprintId: 1,
  templateId: 1,
  ...overrides,
});

export const messageFactoryFull = (
  overrides: Partial<Insertable<Messages>> = {}
): Insertable<Messages> => ({
  id: 1,
  ...messageFactory(overrides),
});

export const messageMatcher = (
  overrides: Partial<Insertable<Messages>> = {}
) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...messageFactory(overrides),
});
