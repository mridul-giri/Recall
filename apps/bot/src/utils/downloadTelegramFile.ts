import axios from "axios";
import { Context } from "grammy";
import { config } from "../utils/config.js";
import { BotError } from "./botError.js";
import BotReplies from "./constants.js";

const downloadTelegramFile = async (ctx: Context) => {
  try {
    const file = await ctx.getFile();
    const fileResponse = await axios.get(
      `https://api.telegram.org/file/bot${config.BOT_TOKEN}/${file.file_path}`,
      {
        responseType: "arraybuffer",
      },
    );
    const fileBuffer = fileResponse.data;
    const parts = file.file_path?.split(".") || [];
    let extension;
    if (parts.length > 1) {
      extension = parts[parts.length - 1];
    }
    const fileSize = file.file_size;

    return { fileBuffer, extension, fileSize };
  } catch (error) {
    throw new BotError(
      BotReplies.UNEXPECTED_ERROR,
      "Failed to download file from Telegram",
    );
  }
};

export default downloadTelegramFile;
