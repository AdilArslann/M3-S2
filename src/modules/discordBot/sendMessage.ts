import { Client } from 'discord.js';
import * as utils from '@/modules/discordBot/utils';
import SendMessageError from './sendMessageError';

export default async (
  discordClient: Client,
  username: string,
  sprint: string,
  template: string,
  sprintCode: string,
  gifURL: string
) => {
  try{
  const guild = utils.getGuild(discordClient);
  const channel = utils.getChannel(guild);
  // const taggedUser = `<@${username}>`; needs userId to tag user, will change it later
  channel.send(`${username} has just completed ${sprint} (${sprintCode})
${template}
${gifURL}`);
  }catch(error){
    throw new SendMessageError("There was an error sending the message.");
  }
};
