import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utils/customError";
import { Replies } from "../../../../utils/constants";
import { TelegramService } from "../../../../services/telegramService";
import { withErrorHandler } from "../../../../utils/withErrorhandler";

async function createDocumentContent(req: NextRequest) {
  const requestOrigin = req.headers.get("x-request-origin");
  if (requestOrigin !== "internal") throw new ApiError("Forbidden", 403);

  const fileSize = req.headers.get("x-file-size");
  const providerId = req.headers.get("x-telegram-id");
  const extension = req.headers.get("x-extension");
  const mimeType = req.headers.get("x-mime-type");
  const fileName = req.headers.get("x-file-name");

  if (!fileSize || !providerId || !extension || !mimeType || !fileName)
    throw new ApiError(Replies.DOCUMENT_SAVE_FAILED, 500);

  const arrayBuffer = await req.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  const contentWithDocumentData = await TelegramService.createDocumentForUser(
    providerId,
    parseInt(fileSize),
    extension,
    mimeType,
    fileBuffer,
    fileName,
  );

  if (!contentWithDocumentData)
    throw new ApiError(Replies.DOCUMENT_SAVE_FAILED, 500);

  return NextResponse.json(
    { message: Replies.DOCUMENT_SAVE_SUCCESS },
    { status: 200 },
  );
}

export const POST = withErrorHandler(createDocumentContent);
