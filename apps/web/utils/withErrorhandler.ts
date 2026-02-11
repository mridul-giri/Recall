import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "./customError";
import { Replies } from "./constants";

export const withErrorHandler =
  (handler: (req: NextRequest) => Promise<NextResponse>) =>
  async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { message: error.message },
          { status: error.statusCode },
        );
      } else {
        console.log("[UpexpectedError]", error);
        return NextResponse.json(
          { message: Replies.UNEXPECTED_ERROR },
          { status: 500 },
        );
      }
    }
  };
