import { expect } from 'vitest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import buildRepository from '../repository';
import { messageFactory, messageMatcher } from './utils';
import { users, sprints, templates } from './fixtures';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createMessages = createFor(db, 'messages');
const selectMessages = selectAllFor(db, 'messages');
const createUsers = createFor(db, 'users');
const createSprints = createFor(db, 'sprints');
const createTemplates = createFor(db, 'templates');

afterEach(async () => {
  await db.deleteFrom('messages').execute();
  await db.deleteFrom('users').execute();
  await db.deleteFrom('sprints').execute();
  await db.deleteFrom('templates').execute();
});

describe('findById', () => {
  it('should return a message by id', async () => {
    const [user] = await createUsers(users);
    const [sprint] = await createSprints(sprints);
    const [template] = await createTemplates(templates);
    const [message] = await createMessages({
      ...messageFactory(),
      userId: user.id,
      sprintId: sprint.id,
      templateId: template.id,
    });

    const result = await repository.findById(message.id);

    expect(result).toEqual(messageMatcher(message));
  });
  it('should return undefined if the message does not exist', async () => {
    const result = await repository.findById(123456);

    expect(result).toBeUndefined();
  });
});

describe('findAll', () => {
  it('should return all messages', async () => {
    const [user, user2] = await createUsers(users);
    const [sprint, sprint2] = await createSprints(sprints);
    const [template, template2] = await createTemplates(templates);
    const [message, message2] = await createMessages([
      {
        ...messageFactory(),
        userId: user.id,
        sprintId: sprint.id,
        templateId: template.id,
      },
      {
        ...messageFactory(),
        userId: user2.id,
        sprintId: sprint2.id,
        templateId: template2.id,
      },
    ]);

    const result = await repository.findAll();

    expect(result).toEqual([messageMatcher(message), messageMatcher(message2)]);
  });
});

describe('create', () => {
  it('should create a message with messageFactory', async () => {
    const [user] = await createUsers(users);
    const [sprint] = await createSprints(sprints);
    const [template] = await createTemplates(templates);
    const message = await repository.create({
      ...messageFactory(),
      userId: user.id,
      sprintId: sprint.id,
      templateId: template.id,
    });

    expect(message).toEqual(messageMatcher());

    const messagesInDatabase = await selectMessages();
    expect(messagesInDatabase).toEqual([messageMatcher()]);
  });
  it('should create a message without messageFactory', async () => {
    const [user] = await createUsers(users);
    const [sprint] = await createSprints(sprints);
    const [template] = await createTemplates(templates);
    const message = await repository.create({
      userId: user.id,
      sprintId: sprint.id,
      templateId: template.id,
    });

    expect(message).toEqual({
      id: expect.any(Number),
      userId: user.id,
      sprintId: sprint.id,
      templateId: template.id,
    });

    const messagesInDatabase = await selectMessages();
    expect(messagesInDatabase).toEqual([message]);
  });
});

describe('update', () => {
  it('should update a message', async () => {
    const [user, user2] = await createUsers(users);
    const [sprint] = await createSprints(sprints);
    const [template] = await createTemplates(templates);
    const [message] = await createMessages({
      ...messageFactory(),
      userId: user.id,
      sprintId: sprint.id,
      templateId: template.id,
    });

    const updatedMessage = await repository.update(message.id, {
      userId: user2.id,
    });

    expect(updatedMessage).toMatchObject(
      messageMatcher({
        userId: user2.id,
      })
    );
  });

  it('should return the original message if there is no changes', async () => {
    const [user] = await createUsers(users);
    const [sprint] = await createSprints(sprints);
    const [template] = await createTemplates(templates);
    const [message] = await createMessages({
      ...messageFactory(),
      userId: user.id,
      sprintId: sprint.id,
      templateId: template.id,
    });

    const updatedMessage = await repository.update(message.id, {});

    expect(updatedMessage).toMatchObject(messageMatcher());
  });
  it('should return undefined if the message does not exist', async () => {
    const [user] = await createUsers(users);
    const updatedMessage = await repository.update(123456, {
      userId: user.id,
    });

    expect(updatedMessage).toBeUndefined();
  });
});

describe('remove', () => {
  it('should remove the message', async () => {
    const [user] = await createUsers(users);
    const [sprint] = await createSprints(sprints);
    const [template] = await createTemplates(templates);
    const [message] = await createMessages({
      ...messageFactory(),
      userId: user.id,
      sprintId: sprint.id,
      templateId: template.id,
    });

    const removedMessage = await repository.remove(message.id);
    expect(removedMessage).toEqual(messageMatcher());

    const messagesInDatabase = await selectMessages();
    expect(messagesInDatabase).toEqual([]);
  });
  it('should return undefined if the message does not exist', async () => {
    const removedMessage = await repository.remove(123456);
    expect(removedMessage).toBeUndefined();
  });
});
