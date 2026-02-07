import { Context } from "grammy";
import { BotService } from "../../services/botService.js";
import BotReplies from "../../utils/constants.js";
import compareSizeLimit from "../../utils/compareSizeLimit.js";
import downloadTelegramFile from "../../utils/downloadTelegramFile.js";
import { ContentType } from "@repo/db";
import { BotError } from "../../utils/botError.js";
import { uploadFileToS3 } from "../../utils/uploadFileToS3.js";

const handleImage = async (ctx: Context) => {
  await ctx.reply(BotReplies.SAVING);
  if (!ctx.message || !ctx.from || !ctx.message?.photo) {
    throw new BotError(BotReplies.UNEXPECTED_ERROR, "Missing required context");
  }

  const telegramId = ctx.from.id.toString();
  const user = await BotService.findUserByTelegramId(telegramId);
  if (!user) {
    throw new BotError(BotReplies.USER_ACCOUNT_NOT_FOUND, "User not found");
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
    extension = "jpg",
    fileBuffer,
  } = await downloadTelegramFile(ctx);

  const contentId = await BotService.createContentWithImageData(
    user.id,
    fileSize,
    extension,
  );
  if (!contentId) {
    throw new BotError(BotReplies.IMAGE_SAVE_FAILED, "Image DB insert failed");
  }

  try {
    const mediaType = `${ContentType.image}/${extension}`;
    await uploadFileToS3(
      contentId,
      ContentType.image,
      extension,
      fileBuffer,
      mediaType,
    );
  } catch (error) {
    await BotService.deleteContentWithAssociatedData(contentId);
    throw new BotError(
      BotReplies.IMAGE_SAVE_FAILED,
      "S3 upload failed, rolled back DB record",
    );
  }

  await ctx.reply(BotReplies.IMAGE_SAVE_SUCCESS);
  console.log("Image saved successfully");
};

export default handleImage;
