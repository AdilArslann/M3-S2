import {
  Client,
  GatewayIntentBits,
  TextChannel,
  Guild,
  GuildMessageManager,
  channelLink,
} from 'discord.js';

export default () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  });
  return client;
};
