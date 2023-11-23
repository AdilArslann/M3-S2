import { omit } from 'lodash/fp';
import { parse, parseInsertable, parsePartial } from '../schema';
import { sprintFactoryFull } from './utils';

it('parses valid record', () => {
  const record = sprintFactoryFull();
  expect(parse(record)).toEqual(record);
});
describe('Throws due error due to missing or empty column (concrete)', () => {
  it('throws an error due to missing or empty sprintCode', () => {
    const sprintWithoutSprintCode = {
      id: 32,
      title: 'Introduction to the TDD',
    };
    const sprintWithEmptySprintCode = {
      id: 43,
      sprintCode: '',
      title: 'Introduction to TDD',
    };

    expect(() => parse(sprintWithoutSprintCode)).toThrow(/sprintCode/i);
    expect(() => parse(sprintWithEmptySprintCode)).toThrow(/sprintCode/i);
  });
  it('Throws an error due to missing or empty title', () => {
    const sprintWithoutTitle = {
      id: 23,
      sprintCode: 'FE.03',
    };
    const sprintWithEmptyTitle = {
      id: 24,
      sprintCode: 'FE.23',
      title: '',
    };

    expect(() => parse(sprintWithoutTitle)).toThrow(/title/i);
    expect(() => parse(sprintWithEmptyTitle)).toThrow(/title/i);
  });
});

describe('Throws error due to missing or empty value for column (generic)', () => {
  it('throws an error due to missing or empty sprintCode', () => {
    const sprintWithoutSprintCode = omit(['sprintCode'], sprintFactoryFull());
    const sprintWithEmptySprintCode = sprintFactoryFull({
      sprintCode: '',
    });

    expect(() => parse(sprintWithoutSprintCode)).toThrow(/sprintCode/i);
    expect(() => parse(sprintWithEmptySprintCode)).toThrow(/sprintCode/i);
  });
  it('throws an error due to missing or empty title', () => {
    const sprintWithoutTitle = omit(['title'], sprintFactoryFull());
    const sprintWithEmptyTitle = sprintFactoryFull({
      title: '',
    });

    expect(() => parse(sprintWithoutTitle)).toThrow(/title/i);
    expect(() => parse(sprintWithEmptyTitle)).toThrow(/title/i);
  });
});

it('parseInsertable. Omits id', () => {
  const parsed = parseInsertable(sprintFactoryFull());
  expect(parsed).not.toHaveProperty('id');
});

it('parsePartial. Omits id', () => {
  const parsed = parsePartial(sprintFactoryFull());
  expect(parsed).not.toHaveProperty('id');
});
