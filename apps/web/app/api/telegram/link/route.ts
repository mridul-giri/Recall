import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utils/customError";
import { TelegramService } from "../../../../services/telegramService";
import { withErrorHandler } from "../../../../utils/withErrorhandler";
import { Replies } from "../../../../utils/constants";

async function createLinkContent(req: NextRequest) {
  const requestOrigin = req.headers.get("x-request-origin");
  if (requestOrigin !== "internal") throw new ApiError("Forbidden", 403);

  const { telegramId, entities, text } = await req.json();
  const providerId = telegramId;

  const contentWithLinkData = await TelegramService.createLinkForUser(
    providerId,
    entities,
    text,
  );

  if (!contentWithLinkData) throw new ApiError(Replies.LINK_SAVE_FAILED, 500);

  return NextResponse.json(
    { message: Replies.LINK_SAVE_SUCCESS },
    { status: 200 },
  );
}

export const POST = withErrorHandler(createLinkContent);
