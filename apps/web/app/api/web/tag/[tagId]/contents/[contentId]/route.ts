import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../../../utils/getCurrentUser";
import { ApiError } from "../../../../../../../utils/customError";
import { withErrorHandler } from "../../../../../../../utils/withErrorhandler";
import { BrowserService } from "../../../../../../../services/browserService";

async function dettachContent(
  req: NextRequest,
  { params }: { params: Promise<{ tagId: string; contentId: string }> },
) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  const { tagId, contentId } = await params;

  await BrowserService.dettachContent(user.id, tagId, contentId);

  return NextResponse.json({ success: true }, { status: 200 });
}

export const DELETE = withErrorHandler(dettachContent);
