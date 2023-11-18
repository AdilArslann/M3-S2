/*
import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import { Insertable } from 'kysely';
import createApp from '@/app';
import * as fixtures from './fixtures';
import { Messages } from '@/database';

const db = await createTestDatabase();
const app = createApp(db);
const createUsers = createFor(db, 'users');
const createSpints = createFor(db, 'sprints');
const createTemplates = createFor(db, 'templates');
const createMessages = createFor(db, 'messages');
const selectMessages = selectAllFor(db, 'messages');

await createUsers(fixtures.users);
await createSpints(fixtures.sprints);
await createTemplates(fixtures.templates);

afterEach(async () => {
  await db.deleteFrom('messages').execute();
});

const messageFactory = (
  overrides: Partial<Insertable<Messages>> = {}
): Insertable<Messages> => ({
  userId: 1,
  sprintId: 1,
  templateId: 1,
  ...overrides,
});

const messageMatcher = (overrides: Partial<Insertable<Messages>> = {}) => ({
  id: expect.any(Number),
  createdAt: expect.any(String),
  ...overrides,
  ...messageFactory(overrides),
});

/*
HOW TF AM I SUPPOSED TO TEST THESE???????????????

describe('GET', () => {
  it('should return all if no username and sprintCode was specified', async () => {
    await supertest(app).post('/messages').send(messageFactory()).expect(201);
    const { body } = await supertest(app).get('/messages').expect(200);

    expect(body).toEqual([messageMatcher()]);
  });
});


describe('POST', () => {
  it('should allow creating a new message', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send(messageFactory())
      .expect(201);

    expect(body).toEqual(messageMatcher());
  });
  it('persists the new message', async () => {
    await supertest(app).post('/messages').send(messageFactory()).expect(201);

    await expect(selectMessages()).resolves.toEqual([messageMatcher()]);
  });
  it('ignores the provided id', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({
        ...messageFactory(),
        id: 123456,
      });

    expect(body.id).not.toEqual(123456);
  });
});
*/
