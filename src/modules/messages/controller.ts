import { Router } from 'express';
import { Client } from 'discord.js';
import { StatusCodes } from 'http-status-codes';
import * as schema from './schema';
import buildRepository from './repository';
import { jsonRoute, unsupportedRoute } from '@/utils/middleware';
import type { Database } from '@/database';
import sendMessage from '../discordBot/sendMessage';
import buildUserRepository from '../users/repository';
import buildSprintRepository from '../sprints/repository';
import randomTemplate from './getRandomTemplate';
import { findUser, findSprint } from './tools';
import fetchGif from '../fetchGif/fetchGif';
import FetchGifError from '../fetchGif/fetchGifError';
import SendMessageError from '../discordBot/sendMessageError';
import BadRequest from '@/utils/errors/BadRequest';

export default (db: Database, discordClient: Client) => {
  const router = Router();
  const messages = buildRepository(db);
  const users = buildUserRepository(db);
  const sprints = buildSprintRepository(db);

  router
    .route('/')
    .post(
      jsonRoute(async (req) => {
        const template = await randomTemplate(db);
        req.body.templateId = template.id;
        const { userId, sprintId, templateId } = schema.parseInsertable(
          req.body
        );
        const user = await users.findById(userId);
        if (!user) {
          throw new BadRequest(`User with ID ${userId} does not exist`);
        }
        const sprint = await sprints.findById(sprintId);
        if (!sprint) {
          throw new BadRequest(`Sprint with ID ${sprintId} does not exist`);
        }

        try {
          const gifURL = await fetchGif();
          sendMessage(
            discordClient,
            user.discordId,
            sprint.title,
            template.content,
            sprint.sprintCode,
            gifURL
          );
        } catch (error) {
          if (error instanceof FetchGifError) {
            throw new Error(error.message);
          } else if (error instanceof SendMessageError) {
            throw new Error(error.message);
          } else {
            throw new Error(
              'There was an error getting the gif and sending the message.'
            );
          }
        }

        const body = {
          userId,
          sprintId,
          templateId,
        };
        return messages.create(body);
      }, StatusCodes.CREATED)
    )
    .get(
      jsonRoute(async (req) => {
        const discordId =
          req.query.discordId !== undefined
            ? String(req.query.discordId)
            : undefined;

        const sprintCode =
          req.query.sprintCode !== undefined
            ? String(req.query.sprintCode)
            : undefined;

        if (sprintCode) {
          const sprintId = await findSprint(db, sprintCode);
          return messages.find(({ eb }) => eb('sprintId', '=', sprintId));
        }

        if (discordId) {
          const userId = await findUser(db, discordId);
          return messages.find(({ eb }) => eb('userId', '=', userId));
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
