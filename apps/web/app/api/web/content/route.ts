import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../utils/getCurrentUser";
import { ApiError } from "../../../../utils/customError";
import { ContentType } from "@repo/db";
import { withErrorHandler } from "../../../../utils/withErrorhandler";
import { BrowserService } from "../../../../services/browserService";
import { contentQuerySchema } from "../../../../lib/schemas";

async function listContent(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const searchParams = req.nextUrl.searchParams;
  const query = contentQuerySchema.parse({
    cursor: searchParams.get("cursor") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
    contentType: searchParams.get("contentType") ?? undefined,
  });

  let decodedCursor = null;
  if (query.cursor) {
    decodedCursor = JSON.parse(Buffer.from(query.cursor, "base64").toString());
  }

  const results = await BrowserService.getContent(
    user.id,
    decodedCursor,
    query.limit,
    query.contentType as ContentType,
  );

  return NextResponse.json(
    {
      data: results.data,
      cursor: results.nextCursor,
      hasMore: results.hasMore,
    },
    { status: 200 },
  );
}

export const GET = withErrorHandler(listContent);
