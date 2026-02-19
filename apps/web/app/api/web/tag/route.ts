import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../utils/getCurrentUser";
import { ApiError } from "../../../../utils/customError";
import { withErrorHandler } from "../../../../utils/withErrorhandler";
import { WebReplies } from "../../../../utils/constants";
import { BrowserService } from "../../../../services/browserService";

async function addTag(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const { tagName } = await req.json();

  if (!tagName || typeof tagName !== "string") {
    throw new ApiError(WebReplies.TAG_NAME_REQUIRED, 400);
  }

  const tag = await BrowserService.createTag(user.id, tagName);

  return NextResponse.json({ data: tag }, { status: 200 });
}

async function getTag(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const result = await BrowserService.listTags(user.id);

  return NextResponse.json({ data: result }, { status: 200 });
}

export const POST = withErrorHandler(addTag);
export const GET = withErrorHandler(getTag);
