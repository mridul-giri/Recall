import { Context } from "grammy";
import { BotService } from "../../services/botService.js";
import BotReplies from "../../utils/constants.js";
import { BotError } from "../../utils/botError.js";

const handleStart = async (ctx: Context) => {
  const from = ctx.from;
  if (!from) {
    throw new BotError(BotReplies.UNEXPECTED_ERROR, "Missing required context");
  }
  const telegramId = from.id.toString();
  const name = from.first_name;
  const userName = from.username;

  const user = await BotService.createOrUpdateUser(telegramId, name, userName);

  if (!user) {
    throw new BotError(
      BotReplies.USER_CREATE_OR_UPDATE_FAILED,
      "Failed to create/update user account",
    );
  }
  await ctx.reply(BotReplies.WELCOME);
  console.log("User account created/updated successfully");
};

export default handleStart;
