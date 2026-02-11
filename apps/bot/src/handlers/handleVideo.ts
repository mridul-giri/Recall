import { Context } from "grammy";
import BotReplies from "../utils/constants.js";
import processVideoJob from "../helpers/processVideoJob.js";


const handleVideo = async (ctx: Context) => {
  await ctx.reply(BotReplies.SAVING);

  void processVideoJob(ctx);

  return;
};

export default handleVideo;
