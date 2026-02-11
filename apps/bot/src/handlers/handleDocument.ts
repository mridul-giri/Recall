import { Context } from "grammy";
import BotReplies from "../utils/constants.js";
import processDocumentJob from "../helpers/processDocumentJob.js";


const handleDocument = async (ctx: Context) => {
  await ctx.reply(BotReplies.SAVING);

  void processDocumentJob(ctx);

  return;
};

export default handleDocument;
