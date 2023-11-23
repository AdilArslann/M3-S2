import { test, vi } from 'vitest';
import { Client } from 'discord.js';
import { sendMessage } from './sendMessage';
import { createApp } from './app'; // import your express app
import { createTestDatabase, createFor, selectAllFor } from './db'; // import your db utilities
import fixtures from './fixtures'; // import your fixtures

vi.mock('sendMessage', () => ({
  sendMessage: test.fn(),
}));

let db;
let app;
let createUsers;
let createSprints;
let createTemplates;
let createMessages;
let selectMessages;

test.before(async () => {
  db = await createTestDatabase();
  app = createApp(db);
  createUsers = createFor(db, 'users');
  createSprints = createFor(db, 'sprints');
  createTemplates = createFor(db, 'templates');
  createMessages = createFor(db, 'messages');
  selectMessages = selectAllFor(db, 'messages');

  await createUsers(fixtures.users);
  await createSprints(fixtures.sprints);
  await createTemplates(fixtures.templates);
});

test.afterEach(async () => {
  await db.deleteFrom('messages').execute();
});

test('POST / should create a new message', async ({ fetch }) => {
  const res = await fetch(app).post('/').send({
    userId: 1,
    sprintId: 1,
  });

  expect(res.status).toEqual(201);
  // Add your own assertions based on the response body
  expect(app.discordClient.sendMessage.called).toBe(true);
});
