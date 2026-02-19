import { BotError } from "../utils/botError.js";
import compareSizeLimit from "../utils/compareSizeLimit.js";
import BotReplies from "../utils/constants.js";
import downloadTelegramFile from "../utils/downloadTelegramFile.js";
import { Context } from "grammy";
import { apiClient } from "../lib/apiClient.js";

const processVideoJob = async (ctx: Context) => {
  if (!ctx.message || !ctx.from || !ctx.message.video) {
    throw new BotError(BotReplies.UNEXPECTED_ERROR, "Missing required context");
  }

  const video = ctx.message.video;
  if (!video.file_size) {
    throw new BotError(
      BotReplies.VIDEO_SAVE_FAILED,
      "video.file_size is undefined",
    );
  }
  const sizeLimit = await compareSizeLimit(video.file_size);
  if (!sizeLimit) {
    throw new BotError(BotReplies.MAX_FILE_SIZE, "File too large");
  }
  const {
    fileSize = video.file_size,
    extension = "mp4",
    fileBuffer,
  } = await downloadTelegramFile(ctx);

  const result = await apiClient.post("api/telegram/video", fileBuffer, {
    headers: {
      "Content-Type": "application/octet-scream",
      "x-file-size": fileSize,
      "x-telegram-id": ctx.from.id.toString(),
      "x-extension": extension,
      "x-mime-type": video.mime_type,
    },
  });

  await ctx.reply(BotReplies.VIDEO_SAVE_SUCCESS);
  console.log(result.data.message || "Video saved successfully");
};

export default processVideoJob;
