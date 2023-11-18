import express from 'express';
import { Client } from 'discord.js';
// import categories from './modules/categories/controller';
import sprints from './modules/sprints/controller';
import users from './modules/users/controller';
import jsonErrorHandler from './middleware/jsonErrors';
import { type Database } from './database';
import templates from './modules/templates/controller';
import messages from './modules/messages/controller';

export default function createApp(db: Database, discordClient?: Client) {
  const app = express();

  app.use(express.json());

  app.use('/templates', templates(db));
  if (discordClient) {
    app.use('/messages', messages(db, discordClient));
  }
  app.use('/sprints', sprints(db));
  app.use('/users', users(db));

  app.use(jsonErrorHandler);

  return app;
}
