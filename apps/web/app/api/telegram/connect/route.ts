import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utils/customError";
import { TelegramService } from "../../../../services/telegramService";
import { config } from "../../../../utils/config";
import { withErrorHandler } from "../../../../utils/withErrorhandler";
import { telegramConnectSchema } from "../../../../lib/schemas";

async function generateAccountLinkToken(req: NextRequest) {
  const requestOrigin = req.headers.get("x-request-origin");
  if (requestOrigin !== "internal") throw new ApiError("Forbidden", 403);

  const body = await req.json();
  const { telegramId } = telegramConnectSchema.parse(body);
  const providerId = telegramId;

  const token = await TelegramService.createWebLinkToken(providerId);

  const deepLink = `${config.CLIENT_URL}/web/connect?token=${token}`;

  return NextResponse.json(deepLink, { status: 200 });
}

export const POST = withErrorHandler(generateAccountLinkToken);
