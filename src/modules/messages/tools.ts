import buildUserRepository from "../users/repository";
import buildSprintRepository from "../sprints/repository";
import type { Database } from '@/database';

export async function findUser(db: Database, discordId: string){
  const users = buildUserRepository(db);
  const user = await users.find(({ eb }) => eb('discordId', '=', discordId));
  return user[0].id;
}

export async function findSprint(db: Database, sprintCode: string){
  const sprints = buildSprintRepository(db);
  const sprint = await sprints.find(({ eb }) => eb('sprintCode', '=', sprintCode));
  return sprint[0].id;
}
