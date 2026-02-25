import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "../../../../utils/withErrorhandler";
import { ApiError } from "../../../../utils/customError";
import { Replies } from "../../../../utils/constants";
import { TelegramService } from "../../../../services/telegramService";
import { videoHeadersSchema } from "../../../../lib/schemas";

async function createVideoContent(req: NextRequest) {
  const requestOrigin = req.headers.get("x-request-origin");
  if (requestOrigin !== "internal") throw new ApiError("Forbidden", 403);

  const headers = videoHeadersSchema.parse({
    fileSize: req.headers.get("x-file-size"),
    providerId: req.headers.get("x-telegram-id"),
    extension: req.headers.get("x-extension"),
    mimeType: req.headers.get("x-mime-type"),
  });

  const arrayBuffer = await req.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  const contentWithVideoData = await TelegramService.createVideoForUser(
    headers.providerId,
    parseInt(headers.fileSize),
    headers.extension,
    headers.mimeType,
    fileBuffer,
  );

  if (!contentWithVideoData) throw new ApiError(Replies.VIDEO_SAVE_FAILED, 500);

  return NextResponse.json(
    { message: Replies.VIDEO_SAVE_SUCCESS },
    { status: 200 },
  );
}

export const POST = withErrorHandler(createVideoContent);
