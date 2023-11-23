import buildUserRepository from '../users/repository';
import buildSprintRepository from '../sprints/repository';
import type { Database } from '@/database';
import BadRequest from '@/utils/errors/BadRequest';

export async function findUser(db: Database, discordId: string) {
  const users = buildUserRepository(db);
  const user = await users.find(({ eb }) => eb('discordId', '=', discordId));
  if (user.length === 0) {
    throw new BadRequest(`User with discordId ${discordId} does not exist`);
  }
  return user[0].id;
}

export async function findSprint(db: Database, sprintCode: string) {
  const sprints = buildSprintRepository(db);
  const sprint = await sprints.find(({ eb }) =>
    eb('sprintCode', '=', sprintCode)
  );
  if (sprint.length === 0) {
    throw new BadRequest(`Sprint with sprintCode ${sprintCode} does not exist`);
  }
  return sprint[0].id;
}
