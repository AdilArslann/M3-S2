import { Client } from 'discord.js';
// import { readFile} from 'fs/promises';
import * as utils from '@/modules/discordBot/utils';
import SendMessageError from './sendMessageError';


export default async (
  discordClient: Client,
  discordId: string,
  sprint: string,
  template: string,
  sprintCode: string,
  gifURL: string
) => {
  
  try {
    const hideURL = getTextToHideUrl();
    const guild = utils.getGuild(discordClient);
    const channel = utils.getChannel(guild);
    await channel.send(`<@${discordId}> has just completed ${sprint} (${sprintCode})
${template} ${hideURL}
${gifURL}`);
  } catch (error) {
    throw new SendMessageError('There was an error sending the message.');
  }
};


function getTextToHideUrl() {
  // sneaky way of hiding gif urls in discord, it's rather a bug but if it works it works
  // source: https://www.quora.com/How-do-I-hide-links-in-Discord#:~:text=To%20hide%20links%20you%20can,'%3E'%20after%20the%20link
  return '||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|||||||';
  /*
  I am honestly done trying to get it from a text file, i don't understand what
  i am possibly doing wrong, like i even tried utf16 but still wasn't able to get 
  the text.
  const hideURL = await readFile('hideUrl.txt', 'utf-8');
  console.log(hideURL.length);
  return hideURL;
  */
}