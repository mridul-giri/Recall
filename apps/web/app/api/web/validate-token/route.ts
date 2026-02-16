import { NextRequest, NextResponse } from "next/server";
import { BrowserService } from "../../../../services/browserService";
import { withErrorHandler } from "../../../../utils/withErrorhandler";
import { cookies } from "next/headers";
import { ApiError } from "../../../../utils/customError";
import { WebReplies } from "../../../../utils/constants";

async function validateToken(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get("token");
  if (!token) throw new ApiError(WebReplies.TOKEN_NOT_FOUND, 404);

  const { userId, tokenId } = await BrowserService.findLinkToken(token);

  const cookieStore = await cookies();
  cookieStore.set("linkingSession", JSON.stringify({ userId, tokenId }), {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    maxAge: 60 * 10,
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({ status: 200 });
}

export const GET = withErrorHandler(validateToken);
