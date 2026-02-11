import { Bot } from "grammy";
import { config } from "./utils/config.js";
import { asyncErrorHandler } from "./utils/asyncErrorHandler.js";
import { handleStart } from "./handlers/handleStart.js";
import handleLink from "./handlers/handleLink.js";
import handleText from "./handlers/handleText.js";
import handleImage from "./handlers/handleImage.js";
import handleVideo from "./handlers/handleVideo.js";
import handleDocument from "./handlers/handleDocument.js";

const bot = new Bot(config.BOT_TOKEN);

bot.command("start", asyncErrorHandler(handleStart));

bot.on("message:entities:url", asyncErrorHandler(handleLink));

bot.on("message:text", asyncErrorHandler(handleText));

bot.on("message:photo", asyncErrorHandler(handleImage));

bot.on("message:video", asyncErrorHandler(handleVideo));

bot.on("message:document", asyncErrorHandler(handleDocument));

export default bot;
