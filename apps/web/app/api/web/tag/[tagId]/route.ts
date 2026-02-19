import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../utils/getCurrentUser";
import { ApiError } from "../../../../../utils/customError";
import { WebReplies } from "../../../../../utils/constants";
import { withErrorHandler } from "../../../../../utils/withErrorhandler";
import { BrowserService } from "../../../../../services/browserService";

async function deleteTag(
  req: NextRequest,
  { params }: { params: Promise<{ tagId: string }> },
) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const { tagId } = await params;

  await BrowserService.deleteTag(user.id, tagId);

  return NextResponse.json({ success: true }, { status: 200 });
}

async function updateTag(
  req: NextRequest,
  { params }: { params: Promise<{ tagId: string }> },
) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const { tagName } = await req.json();
  const { tagId } = await params;

  if (!tagName || typeof tagName !== "string") {
    throw new ApiError(WebReplies.TAG_NAME_REQUIRED, 400);
  }

  const result = await BrowserService.updateTag(user.id, tagId, tagName);

  return NextResponse.json({ data: result }, { status: 200 });
}

export const DELETE = withErrorHandler(deleteTag);
export const PATCH = withErrorHandler(updateTag);
