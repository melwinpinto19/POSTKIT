import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import { connectDB } from "@/lib/db";

const publicAPIRoutes = ["/api/users/login", "/api/users/register"];

export const asyncTryCatchWrapper = (func: any) => {
  const wrapperFunction = async (
    request: NextRequest,
    context: any
  ) => {
    try {
      // Connect to the database
      await connectDB();

      // Check if the request is for a public route
      const isPublicRoute = publicAPIRoutes.includes(request.nextUrl.pathname);

      // Get the user ID if not a public route
      const userId = isPublicRoute ? null : await getLoggedInUserId(request);

      // Check if the user is authenticated if not a public route
      if (!isPublicRoute && !userId) {
        throw new CustomApiError("User is not authenticated", 401);
      }

      return await func(request, userId, context);
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

export const getLoggedInUserId = async (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomApiError("Bearer token is missing or invalid", 401);
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN!) as {
    id: string;
    email: string;
  };

  const user = await User.findById(decoded?.id);

  if (!user) throw new CustomApiError("User is not found", 404);

  return user._id;
};

export class CustomApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
