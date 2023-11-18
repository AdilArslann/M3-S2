import { Client, Guild, TextChannel } from 'discord.js';
import 'dotenv/config';

export function getGuild(
  client: Client,
  guildId: string = process.env.GUILD_ID!
): Guild {
  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    throw new Error(`Guild not found: ${guildId}`);
  }

  return guild;
}

export function getChannel(
  guild: Guild,
  channelName: string = 'accomplishments'
): TextChannel {
  const channel = guild.channels.cache.find(
    (channel) => channel.name === channelName
  );

  if (!channel || !(channel instanceof TextChannel)) {
    throw new Error(`Channel not found: ${channelName}`);
  }

  return channel;
}
