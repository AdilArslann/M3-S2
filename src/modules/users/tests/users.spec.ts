import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { selectAllFor } from '@tests/utils/records';
import { Insertable } from 'kysely';
import createApp from '@/app';
import { Users } from '@/database';

// Creates a test database and passes it to the app
const db = await createTestDatabase();
const app = createApp(db);
// Selects all users from the database
const selectUsers = selectAllFor(db, 'users');

// Deletes all users from the database after each test
afterEach(async () => {
  await db.deleteFrom('users').execute();
});

// Creates a function to create a new user that can be overridden
const userFactory = (
  overrides: Partial<Insertable<Users>> = {}
): Insertable<Users> => ({
  discordId: '847128947891',
  ...overrides,
});

// Creates a matcher for the user that checks for all properties
const userMatcher = (overrides: Partial<Insertable<Users>> = {}) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...userFactory(overrides),
});

describe('POST', () => {
  it('allows creation of a new user', async () => {
    const { body } = await supertest(app)
      .post('/users')
      .send(userFactory())
      .expect(201);

    expect(body).toEqual(userMatcher());
  });

  it('persists the new user', async () => {
    await supertest(app).post('/users').send(userFactory()).expect(201);

    await expect(selectUsers()).resolves.toEqual([userMatcher()]);
  });

  it('ignores the provided id', async () => {
    const { body } = await supertest(app)
      .post('/users')
      .send({
        ...userFactory(),
        id: 123456,
      });

    expect(body.id).not.toEqual(123456);
  });
});

describe('GET', () => {
  it('does get all the users', async () => {
    const user2 = {
      ...userFactory(),
      discordId: '889529572983',
    };

    await supertest(app).post('/users').send(userFactory()).expect(201);
    await supertest(app).post('/users').send(user2).expect(201);
    const { body } = await supertest(app).get('/users').expect(200);

    expect(body).toEqual([userMatcher(), userMatcher(user2)]);
    expect(body.length).toEqual(2);
  });

  it('does get individual users using user/:id route', async () => {
    const { body } = await supertest(app).post('/users').send(userFactory());
    await supertest(app).get(`/users/${body.id}`).expect(200);
    expect(body).toEqual(userMatcher());
  });
  it('throws error if user does not exist', async () => {
    await supertest(app).get('/users/123456').expect(404);
  });
});

describe('PATCH', () => {
  it('does patch discordId', async () => {
    const { body: user } = await supertest(app)
      .post('/users')
      .send(userFactory())
      .expect(201);

    const updateddiscordId = '84782785784';
    const { body: updatedUser } = await supertest(app)
      .patch(`/users/${user.id}`)
      .send({ discordId: updateddiscordId })
      .expect(200);

    expect(updatedUser.discordId).toEqual(updateddiscordId);

    const { body } = await supertest(app).get(`/users/${user.id}`).expect(200);
    expect(body).toEqual(userMatcher({ discordId: updateddiscordId }));
  });
  it('throws error if user does not exist', async () => {
    await supertest(app).patch('/users/123456').expect(404);
  });
});

describe('DELETE', () => {
  it('does delete/remove', async () => {
    const { body: user } = await supertest(app)
      .post('/users')
      .send(userFactory())
      .expect(201);

    await supertest(app).delete(`/users/${user.id}`).expect(200);
    const { body } = await supertest(app).get(`/users/${user.id}`).expect(404);
    expect(body.error.message).toMatch(/not found/i);
  });
  it('presists the changes', async () => {
    const { body: user } = await supertest(app)
      .post('/users')
      .send(userFactory())
      .expect(201);

    await supertest(app).delete(`/users/${user.id}`).expect(200);
    await expect(selectUsers()).resolves.toEqual([]);
  });
  it('throws error if user does not exist', async () => {
    await supertest(app).delete('/users/123456').expect(404);
  });
});
