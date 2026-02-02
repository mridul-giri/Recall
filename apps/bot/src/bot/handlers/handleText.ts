import { Context } from "grammy";
import BotReplies from "../../utils/constants.js";

const handleText = async (ctx: Context) => {
  await ctx.reply(BotReplies.UNSUPPORTED_TEXT_MESSAGE);
};

export default handleText;
