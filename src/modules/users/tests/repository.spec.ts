import { expect } from 'vitest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import buildRepository from '../repository';
import { userFactory, userMatcher } from './utils';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createUsers = createFor(db, 'users');
const selectUsers = selectAllFor(db, 'users');

afterEach(async () => {
  await db.deleteFrom('users').execute();
});

describe('findById', () => {
  it('should return a user by id', async () => {
    const [user] = await createUsers({ discordId: '721478124787' });

    const result = await repository.findById(user.id);

    expect(result).toEqual(userMatcher(user));
  });
  it('should return undefined if the user does not exist', async () => {
    const result = await repository.findById(123456);

    expect(result).toBeUndefined();
  });
});

describe('finAll', () => {
  it('should return all users', async () => {
    const [user1, user2] = await createUsers([
      { discordId: '123456789' },
      { discordId: '987654321' },
    ]);

    const result = await repository.findAll();

    expect(result).toEqual([userMatcher(user1), userMatcher(user2)]);
  });
});

describe('create', () => {
  it('should create a user with userfactory', async () => {
    const user = await repository.create(userFactory());

    expect(user).toEqual(userMatcher());

    const usersInDatabase = await selectUsers();
    expect(usersInDatabase).toEqual([userMatcher()]);
  });
  it('should create a user without userfactory', async () => {
    const user = await repository.create({
      discordId: '123456789',
    });

    expect(user).toEqual({
      id: expect.any(Number),
      discordId: '123456789',
    });

    const usersInDatabase = await selectUsers();
    expect(usersInDatabase).toEqual([user]);
  });
});

describe('update', () => {
  it('should update a user', async () => {
    const [user] = await createUsers(userFactory());

    const updatedUser = await repository.update(user.id, {
      discordId: '5647235264',
    });

    expect(updatedUser).toMatchObject(
      userMatcher({
        discordId: '5647235264',
      })
    );
  });
  it('should return the original if there is no changes', async () => {
    const [user] = await createUsers(userFactory());

    const updatedUser = await repository.update(user.id, {});

    expect(updatedUser).toMatchObject(userMatcher());
  });
  it('should return undefined if user was not found', async () => {
    const updatedUser = await repository.update(48772, {
      discordId: '48488448',
    });

    expect(updatedUser).toBeUndefined();
  });
});

describe('remove', () => {
  it('should remove a user', async () => {
    const [user] = await createUsers(userFactory());

    const removedUser = await repository.remove(user.id);

    expect(removedUser).toEqual(userMatcher());

    const usersInDatabase = await selectUsers();
    expect(usersInDatabase).toEqual([]);
  });
  it('should return undefined if user does not exist', async () => {
    const removedUser = await repository.remove(482194);
    expect(removedUser).toBeUndefined();
  });
});
