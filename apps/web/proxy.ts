import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  try {
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

    const token = await getToken({ req });
    const url = req.nextUrl;

    if (token && url.pathname.startsWith("/auth/register")) {
      return NextResponse.redirect(new URL("/dashboard/tags", req.url));
    }

    if (!token && url.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/register", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("[MiddlewareError]", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/api/:path*", "/auth/:path*", "/dashboard/:path"],
};
