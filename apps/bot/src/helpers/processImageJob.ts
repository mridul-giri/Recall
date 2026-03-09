import { Context } from "grammy";
import { apiClient } from "../lib/apiClient.js";
import { BotError } from "../utils/botError.js";
import compareSizeLimit from "../utils/compareSizeLimit.js";
import BotReplies from "../utils/constants.js";
import downloadTelegramFile from "../utils/downloadTelegramFile.js";
import axios from "axios";

const processImageJob = async (ctx: Context) => {
  try {
    if (!ctx.message || !ctx.from || !ctx.message?.photo) {
      throw new BotError(
        BotReplies.UNEXPECTED_ERROR,
        "Missing required context",
      );
    }
    const photo = ctx.message.photo;
    const largestPhoto = photo[photo.length - 1];
    if (!largestPhoto) {
      throw new BotError(BotReplies.IMAGE_SAVE_FAILED, "photo is undefined");
    }

    const imageSize = largestPhoto.file_size;
    const width = largestPhoto.width;
    const height = largestPhoto.height;

    if (!imageSize) {
      throw new BotError(
        BotReplies.IMAGE_SAVE_FAILED,
        "photo.file_size is undefined",
      );
    }

    const sizeLimit = await compareSizeLimit(imageSize);
    if (!sizeLimit) {
      throw new BotError(BotReplies.MAX_FILE_SIZE, "File too large");
    }
    const {
      fileSize = imageSize,
      extension = "jpeg",
      fileBuffer,
    } = await downloadTelegramFile(ctx);

    const result = await apiClient.post("api/telegram/image", fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "x-file-size": fileSize,
        "x-telegram-id": ctx.from.id.toString(),
        "x-extension": extension,
        "x-width": width,
        "x-height": height,
      },
    });

    await ctx.reply(BotReplies.IMAGE_SAVE_SUCCESS);
    console.log(result.data.message || "Image saved successfully");
  } catch (error) {
    if (error instanceof BotError) {
      try {
        await ctx.reply(error.userMessage);
      } catch {
        console.error(`[BotError] ${error.logMessage || error.userMessage}`);
      }
    } else if (axios.isAxiosError(error)) {
      try {
        await ctx.reply(
          error.response?.data.message || BotReplies.IMAGE_SAVE_FAILED,
        );
      } catch {
        console.error("[AxiosError]", error.response?.data.message);
      }
    } else {
      try {
        await ctx.reply(BotReplies.IMAGE_SAVE_FAILED);
      } catch {
        console.error("[UnexpectedError]", error);
      }
    }
  }
};

export default processImageJob;
