import type { Database } from '@/database';
import { TemplateNotFound } from './errors';
import * as schema from './schema';

export async function getTemplate(db: Database, req:any, templates:any) {
  const id = schema.parseId(req.params.id);
  const template = await templates.findById(id);

  if (!template) {
    throw new TemplateNotFound();
  }
  
  return template
}
