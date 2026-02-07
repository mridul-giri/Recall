import { ContentType } from "@repo/db";
import { BotService } from "../services/botService.js";
import { BotError } from "../utils/botError.js";
import compareSizeLimit from "../utils/compareSizeLimit.js";
import BotReplies from "../utils/constants.js";
import downloadTelegramFile from "../utils/downloadTelegramFile.js";
import { uploadFileToS3 } from "../utils/uploadFileToS3.js";
import { Context } from "grammy";

const processVideoJob = async (
  ctx: Context,
  videoJob: {
    userId: string;
    videoSize: number;
    videoMimeType: string;
  },
) => {
  const sizeLimit = await compareSizeLimit(videoJob.videoSize);
  if (!sizeLimit) {
    throw new BotError(BotReplies.MAX_FILE_SIZE, "File too large");
  }
  const {
    fileSize = videoJob.videoSize,
    extension = "mp4",
    fileBuffer,
  } = await downloadTelegramFile(ctx);

  const contentId = await BotService.createContentWithVideoData(
    videoJob.userId,
    fileSize,
    videoJob.videoMimeType,
  );
  if (!contentId) {
    throw new BotError(BotReplies.VIDEO_SAVE_FAILED, "Video DB insert failed");
  }

  try {
    const mediaType = `${ContentType.video}/${extension}`;
    await uploadFileToS3(
      contentId,
      ContentType.video,
      extension,
      fileBuffer,
      mediaType,
    );
  } catch (error) {
    await BotService.deleteContentWithAssociatedData(contentId);
    throw new BotError(
      BotReplies.VIDEO_SAVE_FAILED,
      "S3 upload failed, rolled back DB record",
    );
  }

  await ctx.reply(BotReplies.VIDEO_SAVE_SUCCESS);
  console.log("Video saved successfully");
};

export default processVideoJob;
