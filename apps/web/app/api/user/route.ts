import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../utils/getCurrentUser";
import { ApiError } from "../../../utils/customError";
import { withErrorHandler } from "../../../utils/withErrorhandler";
import { BrowserService } from "../../../services/browserService";

export async function deleteUser(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.id) throw new ApiError("Unauthorized user", 401);

  await BrowserService.deleteUser(user.id);

  return NextResponse.json({ success: true }, { status: 200 });
}

export const DELETE = withErrorHandler(deleteUser);
