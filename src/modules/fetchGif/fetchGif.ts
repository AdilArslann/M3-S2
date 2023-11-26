import fetch from 'node-fetch';
import 'dotenv/config';
import FetchGifError from './fetchGifError';

export default async function fetchRandomGif() {
  try {
    const response = await fetch(
      `http://api.giphy.com/v1/gifs/random?api_key=${process.env.API_KEY}&tag=congrats`
    );
    const data = await response.json();
    return (data as any).data.url;
  } catch (error) {
    throw new FetchGifError('There was an error fetching the gif.');
  }
}
