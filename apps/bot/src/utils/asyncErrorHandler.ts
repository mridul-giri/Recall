import { Context } from "grammy";
import { BotError } from "./botError.js";

export const asyncErrorHandler = (handler: (ctx: Context) => Promise<void>) => {
  return async (ctx: Context) => {
    try {
      await handler(ctx);
    } catch (error) {
      if (error instanceof BotError) {
        if (error.userMessage) await ctx.reply(error.userMessage);
        console.error(`[BotError] ${error.logMessage || error.userMessage}`);
      } else {
        await ctx.reply("Something went wrong. Please try again.");
        console.error("[UnexpectedError]", error);
      }
    }
  };
};
