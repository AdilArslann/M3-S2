export default class SendMessageError extends Error {
  constructor(message?: string, cause?) {
    super(message, cause);
    this.name = 'SendMessageError';
  }
}
