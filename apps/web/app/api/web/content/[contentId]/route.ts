import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../utils/customError";
import { getCurrentUser } from "../../../../../utils/getCurrentUser";
import { WebReplies } from "../../../../../utils/constants";
import { withErrorHandler } from "../../../../../utils/withErrorhandler";
import { BrowserService } from "../../../../../services/browserService";

async function updateContent(
  req: NextRequest,
  { params }: { params: Promise<{ contentId: string }> },
) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const { contentId } = await params;

  const { isFavorite, title } = await req.json();

  await BrowserService.updateContent(user.id, contentId, {
    isFavorite,
    title,
  });

  return NextResponse.json({ success: true }, { status: 200 });
}

async function deleteContent(
  req: NextRequest,
  { params }: { params: Promise<{ contentId: string }> },
) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const { contentId } = await params;

  const { extension } = await req.json();

  if (!extension || typeof extension !== "string") {
    throw new ApiError(WebReplies.EXTENSION_REQUIRED, 400);
  }

  await BrowserService.deleteContent(user.id, contentId, extension);

  return NextResponse.json({ success: true }, { status: 200 });
}

export const PATCH = withErrorHandler(updateContent);
export const DELETE = withErrorHandler(deleteContent);
