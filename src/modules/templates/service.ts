/*
import type { Request } from 'express';
import type { Database } from '@/database';
import buildRepository from './repository';
import { TemplateNotFound } from './errors';
import * as schema from './schema';
import BadRequest from '@/utils/errors/BadRequest';

export default (db: Database) => {
  const templates = buildRepository(db);

  async function getTemplateWithId(req: Request) {
    const id = schema.parseId(req.params.id);
    const template = await templates.findById(id);

    if (!template) {
      throw new TemplateNotFound();
    }

    return template;
  }
  async function deleteTemplateWithId(req: Request) {
    try {
      const id = schema.parseId(req.params.id);
      const template = await templates.findById(id);

      if (!template) {
        throw new TemplateNotFound();
      }

      await templates.remove(template.id);
    } catch (error:any) {
      if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        throw new BadRequest('This template is in use and cannot be deleted.');
      }
      throw new Error('There was an error deleting the template.');
    }
    return `Template with the id of ${req.params.id} has been deleted.`;
  }

  async function updateTemplateWithId(req: Request) {
    const id = schema.parseId(req.params.id);
    const template = await templates.findById(id);

    if (!template) {
      throw new TemplateNotFound();
    }

    const body = schema.parsePartial(req.body);

    return templates.update(id, body);
  }
  return {
    getTemplateWithId,
    deleteTemplateWithId,
    updateTemplateWithId
  };
};
*/
