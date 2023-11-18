import { Router } from 'express';
import { Client } from 'discord.js';
import { StatusCodes } from 'http-status-codes';
import * as schema from './schema';
import buildRepository from './repository';
import { jsonRoute, unsupportedRoute } from '@/utils/middleware';
import type { Database } from '@/database';
import sendMessage from './sendMessage';
import buildUserRepository from '../users/repository';
import buildSprintRepository from '../sprints/repository';
import buildTemplateRepository from '../templates/repository';
import { findOrFail } from './tools';

export default (db: Database, discordClient: Client) => {
  const router = Router();
  const messages = buildRepository(db);
  const users = buildUserRepository(db);
  const sprints = buildSprintRepository(db);
  const templates = buildTemplateRepository(db);

  router
    .route('/')
    .post(
      jsonRoute(async (req) => {
        const userId = Number(req.body.userId);
        const sprintId = Number(req.body.sprintId);

        if (Number.isNaN(userId) || Number.isNaN(sprintId)) {
          throw new Error('userId and sprintId must be numbers');
        }
        const user = await users.find(({ eb }) => eb('id', '=', userId));
        const sprint = await sprints.find(({ eb }) => eb('id', '=', sprintId));
        const allTemplates = await templates.findAll();
        const template =
          allTemplates[Math.floor(Math.random() * allTemplates.length)];
        sendMessage(
          discordClient,
          user[0].username,
          sprint[0].title,
          template.content,
          sprint[0].sprintCode
        );

        req.body.templateId = template.id;
        const body = schema.parseInsertable(req.body);
        return messages.create(body);
      }, StatusCodes.CREATED)
    )
    .get(
      jsonRoute(async (req) => {
        const username =
          req.body.username !== undefined
            ? String(req.body.username)
            : undefined;
        const sprintCode =
          req.body.sprintCode !== undefined
            ? String(req.body.sprintCode)
            : undefined;

        if (sprintCode) {
          const sprint = await findOrFail(
            sprints,
            'sprintCode',
            sprintCode,
            `No sprint found with code: ${sprintCode}`
          );
          return messages.find(({ eb }) => eb('sprintId', '=', sprint.id));
        }

        if (username) {
          const user = await findOrFail(
            users,
            'username',
            username,
            `No user found with username: ${username}`
          );
          return messages.find(({ eb }) => eb('userId', '=', user.id));
        }

        return messages.findAll();
      })
    );

  router
    .route('/:id')
    .get(unsupportedRoute)
    .delete(unsupportedRoute)
    .patch(unsupportedRoute)
    .put(unsupportedRoute);
  return router;
};
