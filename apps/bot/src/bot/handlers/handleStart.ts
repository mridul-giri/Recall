import { Context } from "grammy";
import { BotRepository } from "../../repository/botRepository.js";

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
      console.error("Failed to create/update user");
      await ctx.reply("Failed to create/update user, Try again!");
      return;
    }
    await ctx.reply("Welcome to the Recall");
    console.log("User created/updated successfully");
  } catch (error) {
    console.error(error);
  }
};

export default handleStart;
