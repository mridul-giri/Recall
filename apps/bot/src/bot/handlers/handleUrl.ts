import { Context } from "grammy";
import { BotRepository } from "../../services/botService.js";
import BotReplies from "../../utils/constants.js";
import parseLinkEntity from "../../utils/parseLinkEntity.js";

const handleUrl = async (ctx: Context) => {
  try {
    if (!ctx.message || !ctx.from) return;
    const text = ctx.message.text ?? ctx.message.caption ?? "";
    const entities = ctx.message.entities ?? ctx.message.caption_entities ?? [];
    if (!text || entities.length === 0 || !entities) return;

    const tgId = ctx.from.id.toString();
    const user = await BotRepository.findUserByTelegramId(tgId);
    if (!user) {
      await ctx.reply(BotReplies.USER_ACCOUNT_NOT_FOUND);
      console.error("User account doesn't exist");
      return;
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

    await ctx.reply(BotReplies.SAVING);

    const contentWithLinkData = await BotRepository.createContentWithLinkData(
      user.id,
      parsedLinks,
    );
    if (!contentWithLinkData) {
      await ctx.reply(BotReplies.LINK_SAVE_FAILED);
      console.log("Failed to save user links");
      return;
    }
    await ctx.reply(BotReplies.LINK_SAVE_SUCCESS);
    console.log("Link saved successfully");
  } catch (error) {
    console.error(error);
  }
};

export default handleUrl;
