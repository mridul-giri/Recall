import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "./customError";
import { Replies } from "./constants";

export const withErrorHandler =
  (handler: (req: NextRequest, params: any) => Promise<NextResponse>) =>
  async (req: NextRequest, params: any) => {
    try {
      return await handler(req, params);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return NextResponse.json(
          { message: errors[0]?.message ?? "Validation failed", errors },
          { status: 400 },
        );
      } else if (error instanceof ApiError) {
        return NextResponse.json(
          { message: error.message },
          { status: error.statusCode },
        );
      } else {
        console.error("[UnexpectedError]", error);
        return NextResponse.json(
          { message: Replies.UNEXPECTED_ERROR },
          { status: 500 },
        );
      }
    }
  };
