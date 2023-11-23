import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { selectAllFor } from '@tests/utils/records';
import { templateFactory, templateMatcher } from './utils';
import createApp from '@/app';

const db = await createTestDatabase();
const app = createApp(db);

const selectTemplates = selectAllFor(db, 'templates');

afterEach(async () => {
  await db.deleteFrom('templates').execute();
});

describe('POST', () => {
  it('should allow creating a new template', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send(templateFactory())
      .expect(201);

    expect(body).toEqual(templateMatcher());
  });
  it('persists the new template', async () => {
    await supertest(app).post('/templates').send(templateFactory()).expect(201);

    await expect(selectTemplates()).resolves.toEqual([templateMatcher()]);
  });
  it('should ignore the provided id', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send({
        ...templateFactory(),
        id: 123456,
      });

    expect(body.id).not.toEqual(123456);
  });
});

describe('GET', () => {
  it('should allow getting all templates', async () => {
    const template2 = {
      ...templateFactory(),
      content: "I'm a template",
    };

    await supertest(app).post('/templates').send(templateFactory()).expect(201);
    await supertest(app).post('/templates').send(template2).expect(201);
    const { body } = await supertest(app).get('/templates').expect(200);

    expect(body).toEqual([templateMatcher(), templateMatcher(template2)]);
    expect(body.length).toEqual(2);
  });
  it('should allow getting a single template', async () => {
    const template = await supertest(app)
      .post('/templates')
      .send(templateFactory())
      .expect(201);

    const { body } = await supertest(app)
      .get(`/templates/${template.body.id}`)
      .expect(200);

    expect(body).toEqual(templateMatcher());
  });
  it('should return a 404 if the template does not exist', async () => {
    await supertest(app).get('/templates/123456').expect(404);
  });
});

describe('PATCH', () => {
  it('should allow updating a template', async () => {
    const template = await supertest(app)
      .post('/templates')
      .send(templateFactory())
      .expect(201);

    await supertest(app)
      .patch(`/templates/${template.body.id}`)
      .send({
        content: 'I am a template',
      })
      .expect(200);
  });
  it('should update the template', async () => {
    const template = await supertest(app)
      .post('/templates')
      .send(templateFactory())
      .expect(201);

    await supertest(app)
      .patch(`/templates/${template.body.id}`)
      .send({
        content: 'I am a template',
      })
      .expect(200);

    await expect(selectTemplates()).resolves.toEqual([
      templateMatcher({
        content: 'I am a template',
      }),
    ]);
  });
  it('should return a 404 if the template does not exist', async () => {
    await supertest(app)
      .patch('/templates/123456')
      .send({
        content: 'I am a template',
      })
      .expect(404);
  });
});

describe('DELETE', () => {
  it('should allow deleting a template', async () => {
    const template = await supertest(app)
      .post('/templates')
      .send(templateFactory())
      .expect(201);

    await supertest(app).delete(`/templates/${template.body.id}`).expect(200);
  });
  it('should delete the template', async () => {
    const template = await supertest(app)
      .post('/templates')
      .send(templateFactory())
      .expect(201);

    await supertest(app).delete(`/templates/${template.body.id}`).expect(200);

    await expect(selectTemplates()).resolves.toEqual([]);
  });
  it('should return a 404 if the template does not exist', async () => {
    await supertest(app).delete('/templates/123456').expect(404);
  });
});
