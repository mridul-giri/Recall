import { Context } from "grammy";
import { BotService } from "../../services/botService.js";
import BotReplies from "../../utils/constants.js";
import parseLinkEntity from "../../utils/parseLinkEntity.js";
import { BotError } from "../../utils/botError.js";

const handleUrl = async (ctx: Context) => {
  await ctx.reply(BotReplies.SAVING);
  if (!ctx.message || !ctx.from) {
    throw new BotError(BotReplies.UNEXPECTED_ERROR, "Missing required context");
  }
  const text = ctx.message.text ?? ctx.message.caption ?? "";
  const entities = ctx.message.entities ?? ctx.message.caption_entities ?? [];
  if (!text || entities.length === 0 || !entities) {
    throw new BotError(BotReplies.UNEXPECTED_ERROR, "Missing required context");
  }

  const telegramId = ctx.from.id.toString();
  const user = await BotService.findUserByTelegramId(telegramId);
  if (!user) {
    throw new BotError(BotReplies.USER_ACCOUNT_NOT_FOUND, "User not found");
  }

  let parsedLinks: Array<{ url: string; provider: string }> = [];

  for (const e of entities) {
    const offset = e.offset;
    const length = e.length;
    const data = parseLinkEntity(text, offset, length);
    if (data) {
      parsedLinks = [
        ...parsedLinks,
        { url: data.url, provider: data.provider },
      ];
    }
  }

  if (parsedLinks.length === 0) {
    throw new BotError(
      BotReplies.NO_VALID_LINK_FOUND,
      "All parsed links were invalid",
    );
  }

  const contentWithLinkData = await BotService.createContentWithLinkData(
    user.id,
    parsedLinks,
  );
  if (!contentWithLinkData) {
    throw new BotError(
      BotReplies.LINK_SAVE_FAILED,
      "Failed to save user links",
    );
  }
  await ctx.reply(BotReplies.LINK_SAVE_SUCCESS);
  console.log("Link saved successfully");
};

export default handleUrl;
