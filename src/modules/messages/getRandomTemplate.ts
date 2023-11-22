import buildTemplateRepository from '../templates/repository';
import BadRequest from '@/utils/errors/BadRequest';
import type { Database } from '@/database';

export default async function getRandomTemplate(db: Database){
  const templates = buildTemplateRepository(db);

  const allTemplates = await templates.findAll();
  if (allTemplates.length === 0) throw new BadRequest('No templates found.');
  const template =
    allTemplates[Math.floor(Math.random() * allTemplates.length)];
  return template;
}
