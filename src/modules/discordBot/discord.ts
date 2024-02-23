import { Client, GatewayIntentBits } from 'discord.js';

export default () => {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });
  return client;
};
