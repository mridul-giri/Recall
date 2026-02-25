import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../../utils/getCurrentUser";
import { ApiError } from "../../../../../../utils/customError";
import { withErrorHandler } from "../../../../../../utils/withErrorhandler";
import { ContentType } from "@repo/db";
import { BrowserService } from "../../../../../../services/browserService";
import {
  attachContentsSchema,
  tagContentQuerySchema,
} from "../../../../../../lib/schemas";

async function attachContents(
  req: NextRequest,
  { params }: { params: Promise<{ tagId: string }> },
) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const { tagId } = await params;
  const body = await req.json();
  const { contentIds } = attachContentsSchema.parse(body);

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
  const query = tagContentQuerySchema.parse({
    cursor: searchParams.get("cursor") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
    type: searchParams.get("type") ?? undefined,
  });

  let decodedCursor = null;
  if (query.cursor) {
    decodedCursor = JSON.parse(Buffer.from(query.cursor, "base64").toString());
  }

  const results = await BrowserService.listContentByTag(
    user.id,
    tagId,
    decodedCursor,
    query.limit,
    query.type as ContentType,
  );

  return NextResponse.json({
    data: results.data,
    cursor: results.nextCursor,
    hasMore: results.hasMore,
  });
}

export const POST = withErrorHandler(attachContents);
export const GET = withErrorHandler(listContent);
