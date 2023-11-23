import { omit } from 'lodash/fp';
import { parse, parseInsertable, parseUpdateable } from '../schema';
import { messageFactoryFull } from './utils';

it('parses valid record', () => {
  const record = messageFactoryFull();
  expect(parse(record)).toEqual(record);
});

describe('Throws due error due to missing or empty column (concrete)', () => {
  it('throws an error due to missing or empty userId', () => {
    const messageWithoutUserId = {
      id: 32,
      sprintId: 23,
      templateId: 12,
    };
    const messageWithEmptyUserId = {
      id: 43,
      userId: '',
      sprintId: 23,
      templateId: 12,
    };

    expect(() => parse(messageWithoutUserId)).toThrow(/userId/i);
    expect(() => parse(messageWithEmptyUserId)).toThrow(/userId/i);
  });
  it('Throws an error due to missing or empty sprintId', () => {
    const messageWithoutSprintId = {
      id: 23,
      userId: 12,
      templateId: 23,
    };
    const messageWithEmptySprintId = {
      id: 24,
      userId: 12,
      sprintId: '',
      templateId: 23,
    };

    expect(() => parse(messageWithoutSprintId)).toThrow(/sprintId/i);
    expect(() => parse(messageWithEmptySprintId)).toThrow(/sprintId/i);
  });
  it('Throws an error due to missing or empty templateId', () => {
    const messageWithoutTemplateId = {
      id: 23,
      userId: 12,
      sprintId: 23,
    };
    const messageWithEmptyTemplateId = {
      id: 24,
      userId: 12,
      sprintId: 23,
      templateId: '',
    };

    expect(() => parse(messageWithoutTemplateId)).toThrow(/templateId/i);
    expect(() => parse(messageWithEmptyTemplateId)).toThrow(/templateId/i);
  });
});

describe('Throws error due to missing or empty value for column (generic)', () => {
  it('throws an error due to missing or empty userId', () => {
    const messageWithoutUserId = omit(['userId'], messageFactoryFull());
    const messageWithEmptyUserId = messageFactoryFull({
      userId: undefined,
    });

    expect(() => parse(messageWithoutUserId)).toThrow(/userId/i);
    expect(() => parse(messageWithEmptyUserId)).toThrow(/userId/i);
  });
  it('throws an error due to missing or empty sprintId', () => {
    const messageWithoutSprintId = omit(['sprintId'], messageFactoryFull());
    const messageWithEmptySprintId = messageFactoryFull({
      sprintId: undefined,
    });

    expect(() => parse(messageWithoutSprintId)).toThrow(/sprintId/i);
    expect(() => parse(messageWithEmptySprintId)).toThrow(/sprintId/i);
  });
  it('throws an error due to missing or empty templateId', () => {
    const messageWithoutTemplateId = omit(['templateId'], messageFactoryFull());
    const messageWithEmptyTemplateId = messageFactoryFull({
      templateId: undefined,
    });

    expect(() => parse(messageWithoutTemplateId)).toThrow(/templateId/i);
    expect(() => parse(messageWithEmptyTemplateId)).toThrow(/templateId/i);
  });
});

it('parseInsertable. Omits id', () => {
  const parsed = parseInsertable(messageFactoryFull());
  expect(parsed).not.toHaveProperty('id');
});

it('parseUpdateable. Omits id', () => {
  const parsed = parseUpdateable(messageFactoryFull());
  expect(parsed).not.toHaveProperty('id');
});
