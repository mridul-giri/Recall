import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../utils/getCurrentUser";
import { ApiError } from "../../../../utils/customError";
import { ContentType } from "@repo/db";
import { withErrorHandler } from "../../../../utils/withErrorhandler";
import { BrowserService } from "../../../../services/browserService";

async function listContent(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const searchParams = req.nextUrl.searchParams;
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "20");
  const type = searchParams.get("contentType") as ContentType;

  let decodedCursor = null;
  if (cursor) {
    decodedCursor = JSON.parse(Buffer.from(cursor, "base64").toString());
  }

  const results = await BrowserService.getContent(
    user.id,
    decodedCursor,
    limit,
    type,
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
