import { omit } from 'lodash/fp';
import { parse, parseInsertable, parsePartial } from '../schema';
import { userFactoryFull } from './utils';

it('parses a valid record', () => {
  const record = userFactoryFull();
  expect(parse(record)).toEqual(record);
});

it('throws an error due to missing/empty discordId (concrete)', () => {
  const userWithoutDiscorId = {
    id: 23,
  };
  const userwithEmptyDiscordId = {
    id: 23,
    discordId: '',
  };

  expect(() => parse(userWithoutDiscorId)).toThrow(/discordId/i);
  expect(() => parse(userwithEmptyDiscordId)).toThrow(/discordId/i);
});

it('throws an error due to missing/empty discordId (generic)', () => {
  const userWithoutDiscorId = omit(['discordId'], userFactoryFull());
  const userwithEmptyDiscordId = userFactoryFull({
    discordId: '',
  });

  expect(() => parse(userWithoutDiscorId)).toThrow(/discordId/i);
  expect(() => parse(userwithEmptyDiscordId)).toThrow(/discordId/i);
});

it('parseInsertable. Omits id', () => {
  const parsed = parseInsertable(userFactoryFull());
  expect(parsed).not.toHaveProperty('id');
});

it('parsePartial. Omits id', () => {
  const parsed = parsePartial(userFactoryFull());
  expect(parsed).not.toHaveProperty('id');
});
