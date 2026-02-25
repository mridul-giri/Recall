import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utils/customError";
import { Replies } from "../../../../utils/constants";
import { TelegramService } from "../../../../services/telegramService";
import { withErrorHandler } from "../../../../utils/withErrorhandler";
import { documentHeadersSchema } from "../../../../lib/schemas";

async function createDocumentContent(req: NextRequest) {
  const requestOrigin = req.headers.get("x-request-origin");
  if (requestOrigin !== "internal") throw new ApiError("Forbidden", 403);

  const headers = documentHeadersSchema.parse({
    fileSize: req.headers.get("x-file-size"),
    providerId: req.headers.get("x-telegram-id"),
    extension: req.headers.get("x-extension"),
    mimeType: req.headers.get("x-mime-type"),
    fileName: req.headers.get("x-file-name"),
  });

  const arrayBuffer = await req.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  const contentWithDocumentData = await TelegramService.createDocumentForUser(
    headers.providerId,
    parseInt(headers.fileSize),
    headers.extension,
    headers.mimeType,
    fileBuffer,
    headers.fileName,
  );

  if (!contentWithDocumentData)
    throw new ApiError(Replies.DOCUMENT_SAVE_FAILED, 500);

  return NextResponse.json(
    { message: Replies.DOCUMENT_SAVE_SUCCESS },
    { status: 200 },
  );
}

export const POST = withErrorHandler(createDocumentContent);
