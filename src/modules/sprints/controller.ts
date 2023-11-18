import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import buildRepository from './repository';
import * as schema from './schema';
import { jsonRoute, unsupportedRoute } from '@/utils/middleware';
import { SprintNotFound } from './errors';
import type { Database } from '@/database';

export default (db: Database) => {
  const router = Router();
  const sprints = buildRepository(db);

  router
    .route('/')
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body);

        return sprints.create(body);
      }, StatusCodes.CREATED)
    )
    .get(jsonRoute(async () => sprints.findAll()));

  router
    .route('/:id')
    .get(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const sprint = await sprints.findById(id);

        if (!sprint) {
          throw new SprintNotFound();
        }
        return sprint;
      })
    )
    .delete(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const sprint = await sprints.findById(id);
        if (!sprint) {
          throw new SprintNotFound();
        }
        return sprints.remove(id);
      })
    )
    .patch(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const body = schema.parsePartial(req.body);
        const sprint = await sprints.findById(id);

        if (!sprint) {
          throw new SprintNotFound();
        }

        return sprints.update(id, body);
      })
    )
    .put(unsupportedRoute);
  return router;
};
