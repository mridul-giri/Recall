import { Context } from "grammy";
import { apiClient } from "../lib/apiClient.js";
import BotReplies from "../utils/constants.js";
import { BotError } from "../utils/botError.js";

const handleLink = async (ctx: Context) => {
  await ctx.reply(BotReplies.SAVING);
  if (!ctx.message || !ctx.from) {
    throw new BotError(BotReplies.UNEXPECTED_ERROR, "Missing required context");
  }
  const text = ctx.message.text ?? "";
  const entities = ctx.message.entities ?? [];
  if (!text || entities.length === 0 || !entities) {
    throw new BotError(BotReplies.UNEXPECTED_ERROR, "Missing required context");
  }

  if (entities.length > 5)
    throw new BotError(BotReplies.LINK_LIMIT_ERROR, "Link limit exceed");

  const result = await apiClient.post("api/telegram/link", {
    telegramId: ctx.from.id.toString(),
    entities,
    text,
  });

  await ctx.reply(BotReplies.LINK_SAVE_SUCCESS);
  console.log(result.data.message || "link saves successfully");
};

export default handleLink;
