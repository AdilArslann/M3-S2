import { expect } from 'vitest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import buildRepository from '../repository';
import { templateFactory, templateMatcher } from './utils';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createTemplates = createFor(db, 'templates');
const selectTemplates = selectAllFor(db, 'templates');

afterEach(async () => {
  await db.deleteFrom('templates').execute();
});

describe('findById', () => {
  it('should return a template by id', async () => {
    const [template] = await createTemplates({ content: 'CONGRATSSSSS!!!' });

    const result = await repository.findById(template.id);
    expect(result).toEqual(templateMatcher(template));
  });
  it('should return undefined if the template does not exist', async () => {
    const result = await repository.findById(2124);
    expect(result).toBeUndefined();
  });
});

describe('findAll', () => {
  it('should return all templates', async () => {
    const [template1, template2] = await createTemplates([
      { content: 'GOOD JOB!' },
      { content: 'Not bad' },
    ]);

    const result = await repository.findAll();

    expect(result).toEqual([
      templateMatcher(template1),
      templateMatcher(template2),
    ]);
  });
});

describe('create', () => {
  it('should create a template with templateFactory', async () => {
    const template = await repository.create(templateFactory());

    expect(template).toEqual(templateMatcher());

    const templatesInDB = await selectTemplates();
    expect(templatesInDB).toEqual([templateMatcher()]);
  });
  it('should create a template without templateFactory', async () => {
    const template = await repository.create({
      content: 'Heyaaa',
    });

    expect(template).toEqual({
      id: expect.any(Number),
      content: 'Heyaaa',
    });

    const templatesInDatabase = await selectTemplates();
    expect(templatesInDatabase).toEqual([template]);
  });
});

describe('update', () => {
  it('should update a template', async () => {
    const [template] = await createTemplates(templateFactory());

    const updatedTemplate = await repository.update(template.id, {
      content: 'Updated content test',
    });

    expect(updatedTemplate).toMatchObject(
      templateMatcher({
        content: 'Updated content test',
      })
    );
  });

  it('should return the original template if there is no changes', async () => {
    const [template] = await createTemplates(templateFactory());

    const updatedTemplate = await repository.update(template.id, {});

    expect(updatedTemplate).toMatchObject(templateMatcher());
  });

  it('should return undefined if template was not found', async () => {
    const updatedTemplate = await repository.update(1233, {
      content: 'this should fail',
    });

    expect(updatedTemplate).toBeUndefined();
  });
});

describe('remove', () => {
  it('should remove the template', async () => {
    const [template] = await createTemplates(templateFactory());

    const removedTemplate = await repository.remove(template.id);
    expect(removedTemplate).toEqual(templateMatcher());
  });

  it('should return undefined if template does not exist', async () => {
    const removedTemplate = await repository.remove(312412);
    expect(removedTemplate).toBeUndefined();
  });
});
