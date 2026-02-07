import { Context } from "grammy";
import compareSizeLimit from "../utils/compareSizeLimit.js";
import { BotError } from "../utils/botError.js";
import BotReplies from "../utils/constants.js";
import downloadTelegramFile from "../utils/downloadTelegramFile.js";
import { BotService } from "../services/botService.js";
import { uploadFileToS3 } from "../utils/uploadFileToS3.js";
import { ContentType } from "@repo/db";

const processDocumentJob = async (
  ctx: Context,
  documentJob: {
    userId: string;
    documentSize: number;
    documentMimeType: string;
    documentFileName: string;
  },
) => {
  const sizeLimit = await compareSizeLimit(documentJob.documentSize);
  if (!sizeLimit) {
    throw new BotError(BotReplies.MAX_FILE_SIZE, "File too large");
  }
  const {
    fileSize = documentJob.documentSize,
    extension = "pdf",
    fileBuffer,
  } = await downloadTelegramFile(ctx);

  const contentId = await BotService.createContentWithDocumentData(
    documentJob.userId,
    fileSize,
    documentJob.documentMimeType,
    documentJob.documentFileName,
  );
  if (!contentId) {
    throw new BotError(BotReplies.VIDEO_SAVE_FAILED, "Video DB insert failed");
  }

  try {
    const mediaType = documentJob.documentMimeType;
    await uploadFileToS3(
      contentId,
      ContentType.document,
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

  await ctx.reply(BotReplies.DOCUMENT_SAVE_SUCCESS);
  console.log("Document saved successfully");
};

export default processDocumentJob;
