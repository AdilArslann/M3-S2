import { Client } from 'discord.js';
import fetch from 'node-fetch';
import * as utils from '@/modules/discordBot/utils';
import 'dotenv/config';

// implement fetch a random GIF related to a celebration or success from an external GIF service (such as Giphy or Tenor API)

async function fetchRandomGif() {
  try {
    const response = await fetch(
      `http://api.giphy.com/v1/gifs/random?api_key=${process.env.API_KEY}&tag=congrats`
    );
    const data = await response.json();
    return (data as any).data.images.original.url;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching GIF:', error);
    return null;
  }
}

export default async (
  discordClient: Client,
  username: string,
  sprint: string,
  template: string,
  sprintCode: string
) => {
  const gifURL = await fetchRandomGif();
  const guild = utils.getGuild(discordClient);
  const channel = utils.getChannel(guild);
  channel.send(`${username} has just completed ${sprint} (${sprintCode})
${template}
${gifURL}`);
};
