import { Client } from 'discord.js';
import * as utils from '@/modules/discordBot/utils';
import SendMessageError from './sendMessageError';
import  getTextToHideUrl  from './getTextToHideUrl';

export default async (
  discordClient: Client,
  discordId: string,
  sprint: string,
  template: string,
  sprintCode: string,
  gifURL: string
) => {
  try {
    const hideURL = await getTextToHideUrl();
    const guild = utils.getGuild(discordClient);
    const channel = utils.getChannel(guild);
    await channel.send(`<@${discordId}> has just completed ${sprint} (${sprintCode})
${template} ${hideURL}
${gifURL}`);
  } catch (error) {
    throw new SendMessageError('There was an error sending the message.',{
      cause: error
    });
  }
};


