import { Context } from "grammy";
import { BotError } from "../utils/botError.js";
import BotReplies from "../utils/constants.js";
import { apiClient } from "../lib/apiClient.js";

export const handleStart = async (ctx: Context) => {
  const telegramUser = ctx.from;
  if (!telegramUser) {
    throw new BotError(BotReplies.UNEXPECTED_ERROR, "Missing required context");
  }

  const result = await apiClient.post("api/telegram/start", {
    telegramId: telegramUser.id.toString(),
    userName: telegramUser.username,
    name: telegramUser.first_name,
  });

  await ctx.reply(BotReplies.WELCOME);
  console.log(result.data.message || "User account created successfully");
};
