import { Context } from "grammy";
import { BotError } from "../utils/botError.js";
import BotReplies from "../utils/constants.js";
import { apiClient } from "../lib/apiClient.js";

const handleConnect = async (ctx: Context) => {
  const telegramUser = ctx.from;
  if (!telegramUser) {
    throw new BotError(BotReplies.UNEXPECTED_ERROR, "Missing required context");
  }

  const result = await apiClient.post("api/telegram/connect", {
    telegramId: telegramUser.id.toString(),
  });

  await ctx.reply(result.data);
  console.log("Account successfully connected");
};

export default handleConnect;
