import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import buildRepository from './repository';
import * as schema from './schema';
import { jsonRoute, unsupportedRoute } from '@/utils/middleware';
import type { Database } from '@/database';
import serviceFactory from './service';

export default (db: Database) => {
  const router = Router();
  const templates = buildRepository(db);
  const service = serviceFactory(db);

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
        const template = await service.getTemplateWithId(req);
        return template
      })
    )
    .delete(
      jsonRoute(async (req) => {
        const result = service.deleteTemplateWithId(req);
        return result;
      })
    )
    .patch(
      jsonRoute(async (req) => {
        const result = service.updateTemplateWithId(req);
        return result;
      })
    )
    .put(unsupportedRoute);

  return router;
};
