import { Insertable } from 'kysely';
import { Sprints } from '@/database';


export const sprintFactory = (
  overrides: Partial<Insertable<Sprints>> = {}
): Insertable<Sprints> => ({
  sprintCode: 'BE.S1',
  title: 'Intro to Backend',
  ...overrides,
});

export const sprintFactoryFull = (
  overrides: Partial<Insertable<Sprints>> = {}
):Insertable<Sprints> => ({
  id: 1,
  ...sprintFactory(overrides),
})

export const sprintMatcher = (overrides: Partial<Insertable<Sprints>> = {}) => ({
  id: expect.any(Number),
  ...overrides,
  ...sprintFactory(overrides),
});
