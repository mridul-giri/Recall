import { Context } from "grammy";
import { apiClient } from "../lib/apiClient.js";
import { BotError } from "../utils/botError.js";
import compareSizeLimit from "../utils/compareSizeLimit.js";
import BotReplies from "../utils/constants.js";
import downloadTelegramFile from "../utils/downloadTelegramFile.js";

const processImageJob = async (ctx: Context) => {
  if (!ctx.message || !ctx.from || !ctx.message?.photo) {
    throw new BotError(BotReplies.UNEXPECTED_ERROR, "Missing required context");
  }
  const photo = ctx.message.photo;
  const imageSize = photo[photo.length - 1]?.file_size;
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
    },
  });

  await ctx.reply(BotReplies.IMAGE_SAVE_SUCCESS);
  console.log(result.data.message || "Image saved successfully");
};

export default processImageJob;
