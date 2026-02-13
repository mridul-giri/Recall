import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utils/customError";
import { withErrorHandler } from "../../../../utils/withErrorhandler";
import { TelegramService } from "../../../../services/telegramService";
import { Replies } from "../../../../utils/constants";

async function createTelegramUser(req: NextRequest) {
  const requestOrigin = req.headers.get("x-request-origin");
  if (requestOrigin !== "internal") throw new ApiError("Forbidden", 403);

  const { telegramId, userName, token } = await req.json();
  const providerId = telegramId;

  if (token) {
    await TelegramService.linkTelegramIdentityWithToken(
      token,
      providerId,
      userName,
    );
    return NextResponse.json(
      { message: Replies.USER_CREATE_SUCCESS },
      { status: 200 },
    );
  }

  const user = await TelegramService.findOrCreateUserWithIdentity(
    providerId,
    userName,
  );

  if (!user) throw new ApiError(Replies.USER_CREATE_FAILED, 500);

  return NextResponse.json(
    { message: Replies.USER_CREATE_SUCCESS },
    { status: 200 },
  );
}

export const POST = withErrorHandler(createTelegramUser);
