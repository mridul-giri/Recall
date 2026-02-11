import { NextRequest, NextResponse } from "next/server";
import { config } from "./utils/config";

export async function proxy(req: NextRequest) {
  const internalToken = req.headers.get("x-internal-token");

  if (internalToken) {
    if (internalToken !== config.BOT_INTERNAL_TOKEN) {
      return NextResponse.json(
        { error: "Invalid internal token" },
        { status: 401 },
      );
    }
  } else {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const requestHeader = new Headers(req.headers);
  requestHeader.set("x-request-origin", "internal");

  return NextResponse.next({
    request: { headers: requestHeader },
  });
}
