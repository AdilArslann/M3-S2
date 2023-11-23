import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import buildRepository from './repository';
import * as schema from './schema';
import { jsonRoute, unsupportedRoute } from '@/utils/middleware';
import type { Database } from '@/database';
import { TemplateNotFound } from './errors';

export default (db: Database) => {
  const router = Router();
  const templates = buildRepository(db);

  router
    .route('/')
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body);

        return templates.create(body);
      }, StatusCodes.CREATED)
    )
    .get(jsonRoute(async () => templates.findAll()));

  router
    .route('/:id')
    .get(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const template = await templates.findById(id);

        if (!template) {
          throw new TemplateNotFound();
        }

        return template;
      })
    )
    .delete(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const template = await templates.findById(id);

        if (!template) {
          throw new TemplateNotFound();
        }

        await templates.remove(template.id);
      })
    )
    .patch(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const template = await templates.findById(id);

        if (!template) {
          throw new TemplateNotFound();
        }

        const body = schema.parsePartial(req.body);

        return templates.update(id, body);
      })
    )
    .put(unsupportedRoute);

  return router;
};
