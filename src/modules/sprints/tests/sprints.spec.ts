import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { selectAllFor } from '@tests/utils/records';
import createApp from '@/app';
import {sprintFactory, sprintMatcher} from './utils';

const db = await createTestDatabase();
const app = createApp(db);
const selectSprints = selectAllFor(db, 'sprints');

afterEach(async () => {
  await db.deleteFrom('sprints').execute();
});


describe('POST', () => {
  it('should allow creating a new sprint', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(sprintFactory())
      .expect(201);

    expect(body).toEqual(sprintMatcher());
  });

  it('persists the new sprint', async () => {
    await supertest(app).post('/sprints').send(sprintFactory()).expect(201);

    await expect(selectSprints()).resolves.toEqual([sprintMatcher()]);
  });

  it('should ignore the provided id', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send({
        ...sprintFactory(),
        id: 123456,
      });

    expect(body.id).not.toEqual(123456);
  });
});

describe('GET', () => {
  it('should allow retrieving all sprints', async () => {
    const sprint2 = {
      ...sprintFactory(),
      sprintCode: 'FE.S1',
      title: 'Intro to Frontend',
    };
    await supertest(app).post('/sprints').send(sprintFactory()).expect(201);
    await supertest(app).post('/sprints').send(sprint2).expect(201);
    const { body } = await supertest(app).get('/sprints').expect(200);

    expect(body).toEqual([sprintMatcher(), sprintMatcher(sprint2)]);
    expect(body).toHaveLength(2);
  });

  it('should allow retrieving a sprint by id', async () => {
    const { body: sprint } = await supertest(app)
      .post('/sprints')
      .send(sprintFactory())
      .expect(201);

    const { body } = await supertest(app)
      .get(`/sprints/${sprint.id}`)
      .expect(200);

    expect(body).toEqual(sprintMatcher());
  });
  it('should throw an error if sprint does not exist', async () => {
    await supertest(app).get('/sprints/123456').expect(404);
  });
});

describe('PATCH /:id', () => {
  it('should allow patching a sprint', async () => {
    const { body: sprint } = await supertest(app)
      .post('/sprints')
      .send(sprintFactory())
      .expect(201);

    const { body } = await supertest(app)
      .patch(`/sprints/${sprint.id}`)
      .send({
        title: 'Intro to Backend',
      })
      .expect(200);

    expect(body).toEqual(sprintMatcher({ title: 'Intro to Backend' }));
  });
  it('should presist the changes', async () => {
    const { body: sprint } = await supertest(app)
      .post('/sprints')
      .send(sprintFactory())
      .expect(201);

    const updatedSprintCode = 'BE.S1';
    const updatedTitle = 'Intro to Backend';
    await supertest(app)
      .patch(`/sprints/${sprint.id}`)
      .send({
        sprintCode: updatedSprintCode,
        title: updatedTitle,
      })
      .expect(200);

    const { body } = await supertest(app)
      .get(`/sprints/${sprint.id}`)
      .expect(200);
    expect(body).toEqual(
      sprintMatcher({ sprintCode: updatedSprintCode, title: updatedTitle })
    );
  });
  it('should throw an error if sprint does not exist', async () => {
    await supertest(app).patch('/sprints/123456').expect(404);
  });
});

describe('DELETE /:id', () => {
  it('does support deleting', async () => {
    const { body: sprint } = await supertest(app)
      .post('/sprints')
      .send(sprintFactory())
      .expect(201);

    await supertest(app).delete(`/sprints/${sprint.id}`).expect(200);
    const { body } = await supertest(app)
      .get(`/sprints/${sprint.id}`)
      .expect(404);
    expect(body.error.message).toEqual('Sprint not found');
  });
  it('persists the changes', async () => {
    const { body: sprint } = await supertest(app)
      .post('/sprints')
      .send(sprintFactory())
      .expect(201);

    await supertest(app).delete(`/sprints/${sprint.id}`).expect(200);
    await expect(selectSprints()).resolves.toEqual([]);
  });
  it('throws error if sprint does not exist', async () => {
    await supertest(app).delete('/sprints/123456').expect(404);
  });
});
