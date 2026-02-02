import { Context } from "grammy";
import { BotRepository } from "../../services/botService.js";
import BotReplies from "../../utils/constants.js";

const handleStart = async (ctx: Context) => {
  try {
    const from = ctx.from;
    if (!from) {
      console.error("ctx.from is undefined");
      return;
    }
    const tgId = from.id.toString();
    const name = from.first_name;
    const userName = from.username;

    const user = await BotRepository.createOrUpdateUser(tgId, name, userName);

    if (!user) {
      console.error("Failed to create/update user account");
      await ctx.reply(BotReplies.USER_CREATE_OR_UPDATE_FAILED);
      return;
    }
    await ctx.reply(BotReplies.WELCOME);
    console.log("User account created/updated successfully");
  } catch (error) {
    console.error(error);
  }
};

export default handleStart;
