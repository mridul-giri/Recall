import { Context } from "grammy";
import BotReplies from "../utils/constants.js";
import processImageJob from "../helpers/processImageJob.js";

const handleImage = async (ctx: Context) => {
  await ctx.reply(BotReplies.SAVING);

  void processImageJob(ctx);

  return;
};

export default handleImage;
