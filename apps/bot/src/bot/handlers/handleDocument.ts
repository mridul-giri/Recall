import { Context } from "grammy";
import { BotError } from "../../utils/botError.js";
import BotReplies from "../../utils/constants.js";
import { BotService } from "../../services/botService.js";
import processDocumentJob from "../../helpers/processDocumentJob.js";

const handleDocument = async (ctx: Context) => {
  await ctx.reply(BotReplies.SAVING);
  if (!ctx.message || !ctx.from || !ctx.message.document) {
    throw new BotError(BotReplies.UNEXPECTED_ERROR, "Missing required context");
  }

  const telegramId = ctx.from.id.toString();
  const user = await BotService.findUserByTelegramId(telegramId);
  if (!user) {
    throw new BotError(BotReplies.USER_ACCOUNT_NOT_FOUND, "User not found");
  }

  const document = ctx.message.document;
  if (!document.file_size) {
    throw new BotError(
      BotReplies.DOCUMENT_SAVE_FAILED,
      "video.file_size is undefined",
    );
  }
  if (!document.mime_type) {
    throw new BotError(
      BotReplies.DOCUMENT_SAVE_FAILED,
      "video.mime_type is undefined",
    );
  }
  if (!document.file_name) {
    throw new BotError(
      BotReplies.DOCUMENT_SAVE_FAILED,
      "video.file_name is undefined",
    );
  }

  const documentJob = {
    userId: user.id,
    documentSize: document.file_size,
    documentMimeType: document.mime_type,
    documentFileName: document.file_name,
  };

  void processDocumentJob(ctx, documentJob);

  return;
};

export default handleDocument;
