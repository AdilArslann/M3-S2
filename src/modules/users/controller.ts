import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import buildRepository from './repository';
import * as schema from './schema';
import { jsonRoute, unsupportedRoute } from '@/utils/middleware';
import { UserNotFound } from './errors';
import type { Database } from '@/database';

export default (db: Database) => {
  const router = Router();
  const users = buildRepository(db);

  router
    .route('/')
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body);

        return users.create(body);
      }, StatusCodes.CREATED)
    )
    .get(jsonRoute(async () => users.findAll()));

  router
    .route('/:id')
    .get(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const user = await users.findById(id);

        if (!user) {
          throw new UserNotFound();
        }
        return user;
      })
    )
    .delete(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const user = await users.findById(id);
        if (!user) {
          throw new UserNotFound();
        }
        await users.remove(id);
      })
    )
    .patch(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const body = schema.parsePartial(req.body);
        const user = await users.findById(id);

        if (!user) {
          throw new UserNotFound();
        }

        return users.update(id, body);
      })
    )
    .put(unsupportedRoute);

  return router;
};
