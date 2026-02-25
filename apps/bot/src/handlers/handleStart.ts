import { Context } from "grammy";
import { BotError } from "../utils/botError.js";
import BotReplies from "../utils/constants.js";
import { apiClient } from "../lib/apiClient.js";

export const handleStart = async (ctx: Context) => {
  const telegramUser = ctx.from;
  if (!telegramUser || !ctx.message?.text) {
    throw new BotError(BotReplies.UNEXPECTED_ERROR, "Missing required context");
  }

  console.log(
    `[handleStart] triggered, message="${ctx.message.text}", userId=${telegramUser.id}, username=${telegramUser.username}`,
  );

  const token = ctx.message.text.split(" ")[1];

  const result = await apiClient.post("api/telegram/start", {
    telegramId: telegramUser.id.toString(),
    userName: telegramUser.username,
    token: token || null,
  });

  await ctx.reply(BotReplies.WELCOME);
  console.log(result.data.message || "User account created successfully");
};
