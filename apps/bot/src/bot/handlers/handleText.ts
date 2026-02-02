import { Context } from "grammy";

const handleText = async (ctx: Context) => {
  await ctx.reply(`Sorry, I cannot save as a note. Recall Bot currently supports these types.
  - Links (article, Youtube video, image,...)
  - Images
  - Video files
  - Document files`);
};

export default handleText;
