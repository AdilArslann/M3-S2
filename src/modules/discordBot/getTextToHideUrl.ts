import { readFile } from 'fs/promises';
import { join } from 'path';

export default async function getTextToHideUrl() {
  // sneaky way of hiding gif urls in discord, it's rather a bug but if it works it works
  // source: https://www.quora.com/How-do-I-hide-links-in-Discord#:~:text=To%20hide%20links%20you%20can,'%3E'%20after%20the%20link

  const hideURL = await readFile(join(__dirname, 'hideUrl.txt'), 'utf-8');
  return hideURL;
}
