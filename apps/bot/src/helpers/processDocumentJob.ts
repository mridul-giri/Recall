import { Context } from "grammy";
import compareSizeLimit from "../utils/compareSizeLimit.js";
import { BotError } from "../utils/botError.js";
import BotReplies from "../utils/constants.js";
import downloadTelegramFile from "../utils/downloadTelegramFile.js";
import { apiClient } from "../lib/apiClient.js";

const processDocumentJob = async (ctx: Context) => {
  if (!ctx.message || !ctx.from || !ctx.message.document) {
    throw new BotError(BotReplies.UNEXPECTED_ERROR, "Missing required context");
  }
  const document = ctx.message.document;
  if (!document.file_size || !document.mime_type || !document.file_name) {
    throw new BotError(
      BotReplies.DOCUMENT_SAVE_FAILED,
      "Document is undefined",
    );
  }

  const sizeLimit = await compareSizeLimit(document.file_size);
  if (!sizeLimit) {
    await ctx.reply(BotReplies.MAX_FILE_SIZE);
    throw new BotError(BotReplies.MAX_FILE_SIZE, "File too large");
  }
  const {
    fileSize = document.file_size,
    extension = "pdf",
    fileBuffer,
  } = await downloadTelegramFile(ctx);

  const result = await apiClient.post("api/telegram/document", fileBuffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "x-file-size": fileSize,
      "x-telegram-id": ctx.from.id.toString(),
      "x-extension": extension,
      "x-mime-type": document.mime_type,
      "x-file-name": document.file_name,
    },
  });

  await ctx.reply(BotReplies.DOCUMENT_SAVE_SUCCESS);
  console.log(result.data.message || "Document saved successfully");
};

export default processDocumentJob;
