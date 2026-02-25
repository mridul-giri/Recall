import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../utils/customError";
import { getCurrentUser } from "../../../../../utils/getCurrentUser";
import { withErrorHandler } from "../../../../../utils/withErrorhandler";
import { BrowserService } from "../../../../../services/browserService";
import { updateContentSchema } from "../../../../../lib/schemas";

async function updateContent(
  req: NextRequest,
  { params }: { params: Promise<{ contentId: string }> },
) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const { contentId } = await params;

  const body = await req.json();
  const { title } = updateContentSchema.parse(body);

  await BrowserService.updateContent(user.id, contentId, title);

  return NextResponse.json({ success: true }, { status: 200 });
}

async function deleteContent(
  req: NextRequest,
  { params }: { params: Promise<{ contentId: string }> },
) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const { contentId } = await params;

  const searchParams = req.nextUrl.searchParams;
  const extension = searchParams.get("extension");

  await BrowserService.deleteContent(user.id, contentId, extension);

  return NextResponse.json({ success: true }, { status: 200 });
}

export const PATCH = withErrorHandler(updateContent);
export const DELETE = withErrorHandler(deleteContent);
