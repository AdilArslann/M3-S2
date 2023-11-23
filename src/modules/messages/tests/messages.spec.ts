import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import { Client, GatewayIntentBits } from 'discord.js';
import { expect, vi } from 'vitest';
import createApp from '@/app';
import { messageMatcher } from './utils';
import { users, sprints, templates } from './fixtures';

vi.mock('@/modules/discordBot/sendMessage');

const db = await createTestDatabase();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const app = createApp(db, client);
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

describe('GET messages', () => {
  it('should return all messages', async () => {
    const [user, user2] = await createUsers(users);
    const [sprint, sprint2] = await createSprints(sprints);
    const [template, template2] = await createTemplates(templates);
    const [message, message2] = await createMessages([
      {
        userId: user.id,
        sprintId: sprint.id,
        templateId: template.id,
      },
      {
        userId: user2.id,
        sprintId: sprint2.id,
        templateId: template2.id,
      },
    ]);

    const response = await supertest(app).get('/messages').expect(200);

    expect(response.body).toEqual([
      messageMatcher(message),
      messageMatcher(message2),
    ]);
  });
  it('should return an empty array if there are no messages', async () => {
    const response = await supertest(app).get('/messages').expect(200);

    expect(response.body).toEqual([]);
  });
  it('should return messages by sprintCode', async () => {
    const [user, user2] = await createUsers(users);
    const [sprint, sprint2] = await createSprints(sprints);
    const [template, template2] = await createTemplates(templates);
    const [message, message2] = await createMessages([
      {
        userId: user.id,
        sprintId: sprint.id,
        templateId: template.id,
      },
      {
        userId: user2.id,
        sprintId: sprint2.id,
        templateId: template2.id,
      },
    ]);

    const response = await supertest(app)
      .get(`/messages?sprintCode=${sprint.sprintCode}`)
      .expect(200);
    const response2 = await supertest(app)
      .get(`/messages?sprintCode=${sprint2.sprintCode}`)
      .expect(200);

    expect(response.body).toEqual([messageMatcher(message)]);
    expect(response2.body).toEqual([messageMatcher(message2)]);
  });
  it('should return messages by discordId', async () => {
    const [user, user2] = await createUsers(users);
    const [sprint, sprint2] = await createSprints(sprints);
    const [template, template2] = await createTemplates(templates);
    const [message, message2] = await createMessages([
      {
        userId: user.id,
        sprintId: sprint.id,
        templateId: template.id,
      },
      {
        userId: user2.id,
        sprintId: sprint2.id,
        templateId: template2.id,
      },
    ]);

    const response = await supertest(app)
      .get(`/messages?discordId=${user.discordId}`)
      .expect(200);
    const response2 = await supertest(app)
      .get(`/messages?discordId=${user2.discordId}`)
      .expect(200);

    expect(response.body).toEqual([messageMatcher(message)]);
    expect(response2.body).toEqual([messageMatcher(message2)]);
  });
  it('should return error if discordId does not exist', async () => {
    const response = await supertest(app)
      .get(`/messages?discordId=123`)
      .expect(400);

    expect(response.body).toEqual({
      error: {
        message: 'User with discordId 123 does not exist',
        status: 400,
      },
    });
  });
  it('should return error if sprintCode does not exist', async () => {
    const response = await supertest(app)
      .get(`/messages?sprintCode=123`)
      .expect(400);

    expect(response.body).toEqual({
      error: {
        message: 'Sprint with sprintCode 123 does not exist',
        status: 400,
      },
    });
  });
  it('if the discordId exists but there are no messages for that user', async () => {
    const [user, user2] = await createUsers(users);

    const response = await supertest(app)
      .get(`/messages?discordId=${user.discordId}`)
      .expect(200);
    const response2 = await supertest(app)
      .get(`/messages?discordId=${user2.discordId}`)
      .expect(200);
    expect(response.body).toEqual([]);
    expect(response2.body).toEqual([]);
  });
  it('if the sprintCode exists but there are no messages for that sprint', async () => {
    const [sprint, sprint2] = await createSprints(sprints);

    const response = await supertest(app)
      .get(`/messages?sprintCode=${sprint.sprintCode}`)
      .expect(200);
    const response2 = await supertest(app)
      .get(`/messages?sprintCode=${sprint2.sprintCode}`)
      .expect(200);
    expect(response.body).toEqual([]);
    expect(response2.body).toEqual([]);
  });
});

describe('POST messages', () => {
  it('should create a message', async () => {
    const [user] = await createUsers(users);
    const [sprint] = await createSprints(sprints);
    const createdTemplates = await createTemplates(templates);
    const message = {
      userId: user.id,
      sprintId: sprint.id,
    };

    const response = await supertest(app)
      .post('/messages')
      .send(message)
      .expect(201);
    expect(response.body).toMatchObject(message);

    // making sure it actually generates a templateId using ones that exist in the database
    expect(response.body).toHaveProperty('templateId');

    // extracting only the ids of the templates
    const templateIds = createdTemplates.map((template) => template.id);
    expect(templateIds).toContain(response.body.templateId);

    // check the database to make sure it was created
    const messagesInDB = await selectMessages();
    expect(messagesInDB).toEqual([response.body]);
  });
  it('should throw an error if the user does not exist', async () => {
    const [sprint] = await createSprints(sprints);
    await createTemplates(templates);
    const message = {
      userId: 123,
      sprintId: sprint.id,
    };

    const response = await supertest(app)
      .post('/messages')
      .send(message)
      .expect(400);
    expect(response.body).toEqual({
      error: {
        message: 'User with ID 123 does not exist',
        status: 400,
      },
    });
  });
  it('should throw an error if the sprint does not exist', async () => {
    const [user] = await createUsers(users);
    await createTemplates(templates);
    const message = {
      userId: user.id,
      sprintId: 123,
    };

    const response = await supertest(app)
      .post('/messages')
      .send(message)
      .expect(400);
    expect(response.body).toEqual({
      error: {
        message: 'Sprint with ID 123 does not exist',
        status: 400,
      },
    });
  });
  it('should throw an error if the template does not exist', async () => {
    const [user] = await createUsers(users);
    const [sprint] = await createSprints(sprints);
    const message = {
      userId: user.id,
      sprintId: sprint.id,
    };

    const response = await supertest(app)
      .post('/messages')
      .send(message)
      .expect(400);
    expect(response.body).toEqual({
      error: {
        message: 'No templates found.',
        status: 400,
      },
    });
  });
  it('should throw an error if the user did not give a sprintId', async () => {
    const [user] = await createUsers(users);
    await createTemplates(templates);
    const message = {
      userId: user.id,
    };

    const { body } = await supertest(app)
      .post('/messages')
      .send(message)
      .expect(400);
    expect(body.error.message).toMatch(/sprintId/i);
  });
  it('should throw an error if the user did not give a userId', async () => {
    const [sprint] = await createSprints(sprints);
    await createTemplates(templates);
    const message = {
      sprintId: sprint.id,
    };

    const { body } = await supertest(app)
      .post('/messages')
      .send(message)
      .expect(400);
    expect(body.error.message).toMatch(/userId/i);
  });
});
