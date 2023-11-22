export default class FetchGifError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'FetchGifError';
  }
}