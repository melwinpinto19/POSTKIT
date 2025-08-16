import { NextRequest, NextResponse } from "next/server";

export const asyncTryCatchWrapper = (func: any) => {
  const wrapperFunction = async (request: NextRequest) => {
    try {
      return await func(request);
    } catch (error) {
      if (error instanceof CustomApiError)
        return NextResponse.json(
          { message: error.message },
          { status: error.status, statusText: error.message }
        );
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500, statusText: "Internal server error" }
      );
    }
  };
  return wrapperFunction;
};

export class CustomApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
