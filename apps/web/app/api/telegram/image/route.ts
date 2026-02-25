import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utils/customError";
import { withErrorHandler } from "../../../../utils/withErrorhandler";
import { Replies } from "../../../../utils/constants";
import { TelegramService } from "../../../../services/telegramService";
import { imageHeadersSchema } from "../../../../lib/schemas";

async function createImageContent(req: NextRequest) {
  const requestOrigin = req.headers.get("x-request-origin");
  if (requestOrigin !== "internal") throw new ApiError("Forbidden", 403);

  const headers = imageHeadersSchema.parse({
    fileSize: req.headers.get("x-file-size"),
    providerId: req.headers.get("x-telegram-id"),
    extension: req.headers.get("x-extension"),
    width: req.headers.get("x-width"),
    height: req.headers.get("x-height"),
  });

  const arrayBuffer = await req.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  const contentWithImageData = await TelegramService.createImageForUser(
    headers.providerId,
    parseInt(headers.fileSize),
    headers.extension,
    fileBuffer,
    headers.width,
    headers.height,
  );

  if (!contentWithImageData) throw new ApiError(Replies.IMAGE_SAVE_FAILED, 500);

  return NextResponse.json(
    { message: Replies.IMAGE_SAVE_SUCCESS },
    { status: 200 },
  );
}

export const POST = withErrorHandler(createImageContent);
