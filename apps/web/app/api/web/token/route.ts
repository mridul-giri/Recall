import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utils/customError";
import { getCurrentUser } from "../../../../utils/getCurrentUser";
import { BrowserService } from "../../../../services/browserService";
import { withErrorHandler } from "../../../../utils/withErrorhandler";

async function generateToken(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const token = await BrowserService.generateToken(user.id);

  const deepLink = `https://t.me/TheRecallBot?start=${token}`;

  return NextResponse.json(deepLink);
}

export const GET = withErrorHandler(generateToken);
