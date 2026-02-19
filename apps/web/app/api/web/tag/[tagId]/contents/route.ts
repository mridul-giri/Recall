import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../../utils/getCurrentUser";
import { ApiError } from "../../../../../../utils/customError";
import { WebReplies } from "../../../../../../utils/constants";
import { withErrorHandler } from "../../../../../../utils/withErrorhandler";
import { ContentType } from "@repo/db";
import { BrowserService } from "../../../../../../services/browserService";

async function attachContents(
  req: NextRequest,
  { params }: { params: Promise<{ tagId: string }> },
) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const { tagId } = await params;
  const { contentIds } = await req.json();

  await BrowserService.attachContents(user.id, contentIds, tagId);

  return NextResponse.json({ success: true }, { status: 200 });
}

async function listContent(
  req: NextRequest,
  { params }: { params: Promise<{ tagId: string }> },
) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const { tagId } = await params;

  const searchParams = req.nextUrl.searchParams;
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "20");
  const type = searchParams.get("type") as ContentType;
  let decodedCursor = null;
  if (cursor) {
    decodedCursor = JSON.parse(Buffer.from(cursor, "base64").toString());
  }

  const results = await BrowserService.listContentByTag(
    user.id,
    tagId,
    decodedCursor,
    limit,
    type,
  );

  return NextResponse.json({
    data: results.data,
    cursor: results.nextCursor,
    hasMore: results.hasMore,
  });
}

export const POST = withErrorHandler(attachContents);
export const GET = withErrorHandler(listContent);
