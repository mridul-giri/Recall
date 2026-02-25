import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../../utils/getCurrentUser";
import { ApiError } from "../../../../../../utils/customError";
import { withErrorHandler } from "../../../../../../utils/withErrorhandler";
import { BrowserService } from "../../../../../../services/browserService";

async function listContentTags(
  req: NextRequest,
  { params }: { params: Promise<{ contentId: string }> },
) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const { contentId } = await params;
  const result = await BrowserService.getContentTags(user.id, contentId);

  return NextResponse.json({ data: result }, { status: 200 });
}

export const GET = withErrorHandler(listContentTags);
