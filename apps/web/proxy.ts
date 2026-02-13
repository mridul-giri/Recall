import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const internalToken = req.headers.get("x-internal-token");

  if (internalToken) {
    if (internalToken !== process.env.BOT_INTERNAL_TOKEN) {
      return NextResponse.json(
        { error: "Invalid internal token" },
        { status: 401 },
      );
    }

    const requestHeader = new Headers(req.headers);
    requestHeader.set("x-request-origin", "internal");

    return NextResponse.next({
      request: { headers: requestHeader },
    });
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
