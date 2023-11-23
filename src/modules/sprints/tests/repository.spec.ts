import { expect } from 'vitest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import buildRepository from '../repository';
import { sprintFactory, sprintMatcher } from './utils';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createSprints = createFor(db, 'sprints');
const selectSprints = selectAllFor(db, 'sprints');

afterEach(async () => {
  await db.deleteFrom('sprints').execute();
});

describe('findById', () => {
  it('should return a sprint by id', async () => {
    const [sprint] = await createSprints(sprintFactory());
    const result = await repository.findById(sprint.id);

    expect(result).toEqual(sprintMatcher());
  });
  it('should return undefined if the sprint does not exist', async () => {
    const result = await repository.findById(8498);
    expect(result).toBeUndefined();
  });
});

describe('findAll', () => {
  it('should return all sprints', async () => {
    const [sprint1, sprint2] = await createSprints([
      { sprintCode: 'FE.01', title: 'Introduction to HTML' },
      { sprintCode: 'FE.02', title: 'Introduction to Javascript' },
    ]);

    const result = await repository.findAll();

    expect(result).toEqual([sprint1, sprint2]);
  });
});

describe('create', () => {
  it('should create a sprint with sprintFactory', async () => {
    const sprint = await repository.create(sprintFactory());

    expect(sprint).toEqual(sprintMatcher());

    const sprintsInDB = await selectSprints();
    expect(sprintsInDB).toEqual([sprintMatcher()]);
  });
  it('should create a sprint without sprintFactory', async () => {
    const sprint = await repository.create({
      sprintCode: 'PY.01',
      title: 'Introduction to Python',
    });

    expect(sprint).toEqual({
      id: expect.any(Number),
      sprintCode: 'PY.01',
      title: 'Introduction to Python',
    });

    const sprintsInDB = await selectSprints();
    expect(sprintsInDB).toEqual([sprint]);
  });
});

describe('update', () => {
  it('should update a sprints sprintCode', async () => {
    const [sprint] = await createSprints(sprintFactory());

    const updatedSprint = await repository.update(sprint.id, {
      sprintCode: 'Test sprintCode',
    });

    expect(updatedSprint).toMatchObject(
      sprintMatcher({
        sprintCode: 'Test sprintCode',
      })
    );
  });
  it('should update a sprints title', async () => {
    const [sprint] = await createSprints(sprintFactory());

    const updatedSprint = await repository.update(sprint.id, {
      title: 'Test title',
    });

    expect(updatedSprint).toMatchObject(
      sprintMatcher({
        title: 'Test title',
      })
    );
  });
  it('should return the original if no changes were made', async () => {
    const [sprint] = await createSprints(sprintFactory());

    const updatedSprint = await repository.update(sprint.id, {});

    expect(updatedSprint).toMatchObject(sprintMatcher());
  });
  it('should return undefined if sprint does not exist', async () => {
    const updatedSprint = await repository.update(2313, {
      sprintCode: 'Test sprintCode',
      title: 'Test title',
    });

    expect(updatedSprint).toBeUndefined();
  });
});

describe('remove', () => {
  it('should remove a sprint', async () => {
    const [sprint] = await createSprints(sprintFactory());

    const removedSprint = await repository.remove(sprint.id);

    expect(removedSprint).toEqual(sprintMatcher());

    const sprintsInDB = await selectSprints();
    expect(sprintsInDB).toEqual([]);
  });
  it('should return undefined if sprint does not exist', async () => {
    const removedSprint = await repository.remove(312);
    expect(removedSprint).toBeUndefined();
  });
});
