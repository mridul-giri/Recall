import { Context } from "grammy";
import { BotService } from "../../services/botService.js";
import BotReplies from "../../utils/constants.js";
import { BotError } from "../../utils/botError.js";
import processVideoJob from "../../helpers/processVideoJob.js";

const handleVideo = async (ctx: Context) => {
  await ctx.reply(BotReplies.SAVING);
  if (!ctx.message || !ctx.from || !ctx.message.video) {
    throw new BotError(BotReplies.UNEXPECTED_ERROR, "Missing required context");
  }

  const telegramId = ctx.from.id.toString();
  const user = await BotService.findUserByTelegramId(telegramId);
  if (!user) {
    throw new BotError(BotReplies.USER_ACCOUNT_NOT_FOUND, "User not found");
  }

  const video = ctx.message.video;
  if (!video.file_size) {
    throw new BotError(
      BotReplies.VIDEO_SAVE_FAILED,
      "video.file_size is undefined",
    );
  }
  if (!video.mime_type) {
    throw new BotError(
      BotReplies.VIDEO_SAVE_FAILED,
      "video.mime_type is undefined",
    );
  }

  const videoJob = {
    userId: user.id,
    videoSize: video.file_size,
    videoMimeType: video.mime_type,
  };

  void processVideoJob(ctx, videoJob);

  return;
};

export default handleVideo;
