import { Bot } from "grammy";
import { config } from "../config/config.js";
import handleStart from "./handlers/handleStart.js";
import handleText from "./handlers/handleText.js";
import handleUrl from "./handlers/handleUrl.js";

const bot = new Bot(config.BOT_TOKEN);

bot.command("start", handleStart);

bot.on("message:entities:url", handleUrl);

bot.on("message:text", handleText);

export default bot;
