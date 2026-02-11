import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utils/customError";
import { withErrorHandler } from "../../../../utils/withErrorhandler";
import { Replies } from "../../../../utils/constants";
import { TelegramService } from "../../../../services/telegramService";

async function createImageContent(req: NextRequest) {
  const requestOrigin = req.headers.get("x-request-origin");
  if (requestOrigin !== "internal") throw new ApiError("Forbidden", 403);

  const fileSize = req.headers.get("x-file-size");
  const providerId = req.headers.get("x-telegram-id");
  const extension = req.headers.get("x-extension");

  if (!providerId || !extension || !fileSize)
    throw new ApiError(Replies.IMAGE_SAVE_FAILED, 500);

  const arrayBuffer = await req.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  const contentWithImageData = await TelegramService.createImageForUser(
    providerId,
    parseInt(fileSize),
    extension,
    fileBuffer,
  );

  if (!contentWithImageData) throw new ApiError(Replies.IMAGE_SAVE_FAILED, 500);

  return NextResponse.json(
    { message: Replies.IMAGE_SAVE_SUCCESS },
    { status: 200 },
  );
}

export const POST = withErrorHandler(createImageContent);
