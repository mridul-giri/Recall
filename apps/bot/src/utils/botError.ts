export class BotError extends Error {
  constructor(
    public userMessage: string,
    public logMessage?: string,
  ) {
    super(logMessage || userMessage);
    this.name = "BotError";
  }
}
