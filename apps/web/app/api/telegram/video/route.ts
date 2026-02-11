import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "../../../../utils/withErrorhandler";
import { ApiError } from "../../../../utils/customError";
import { Replies } from "../../../../utils/constants";
import { TelegramService } from "../../../../services/telegramService";

async function createVideoContent(req: NextRequest) {
  const requestOrigin = req.headers.get("x-request-origin");
  if (requestOrigin !== "internal") throw new ApiError("Forbidden", 403);

  const fileSize = req.headers.get("x-file-size");
  const providerId = req.headers.get("x-telegram-id");
  const extension = req.headers.get("x-extension");
  const mimeType = req.headers.get("x-mime-type");

  if (!fileSize || !providerId || !extension || !mimeType)
    throw new ApiError(Replies.IMAGE_SAVE_FAILED, 500);

  const arrayBuffer = await req.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  const contentWithVideoData = await TelegramService.createVideoForUser(
    providerId,
    parseInt(fileSize),
    extension,
    mimeType,
    fileBuffer,
  );

  if (!contentWithVideoData) throw new ApiError(Replies.VIDEO_SAVE_FAILED, 500);

  return NextResponse.json(
    { message: Replies.VIDEO_SAVE_SUCCESS },
    { status: 200 },
  );
}

export const POST = withErrorHandler(createVideoContent);
