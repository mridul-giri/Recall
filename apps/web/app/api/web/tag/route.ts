import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../utils/getCurrentUser";
import { ApiError } from "../../../../utils/customError";
import { withErrorHandler } from "../../../../utils/withErrorhandler";
import { BrowserService } from "../../../../services/browserService";
import { createTagSchema } from "../../../../lib/schemas";

async function addTag(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const body = await req.json();
  const { tagName } = createTagSchema.parse(body);

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
