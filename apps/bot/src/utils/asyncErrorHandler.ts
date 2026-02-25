import { Context } from "grammy";
import { BotError } from "./botError.js";
import axios from "axios";
import BotReplies from "./constants.js";

export const asyncErrorHandler = (handler: (ctx: Context) => Promise<void>) => {
  return async (ctx: Context) => {
    try {
      await handler(ctx);
    } catch (error) {
      if (error instanceof BotError) {
        try {
          if (error.userMessage) await ctx.reply(error.userMessage);
        } catch {}
        console.error(`[BotError] ${error.logMessage || error.userMessage}`);
      } else {
        if (axios.isAxiosError(error)) {
          try {
            await ctx.reply(
              error.response?.data.message || BotReplies.UNEXPECTED_ERROR,
            );
          } catch {}
          console.error("[AxiosError]", error.response?.data.message);
        } else {
          try {
            await ctx.reply(BotReplies.UNEXPECTED_ERROR);
          } catch {}
          console.error("[UnexpectedError]", error);
        }
      }
    }
  };
};
