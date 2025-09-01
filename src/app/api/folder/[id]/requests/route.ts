import { Request } from "@/models/request";
import { asyncTryCatchWrapper, CustomApiError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

interface Context {
  params: Promise<{ [key: string]: string }>;
}

// Get Folder by ID
export const GET = asyncTryCatchWrapper(
  async (
    _req: NextRequest,
    userId: mongoose.Types.ObjectId,
    { params }: Context
  ) => {
    const { id } = await params;
    const requests = await Request.find({
      folder: id,
      createdBy: userId,
    });
    if (!requests) throw new CustomApiError("Requests not found", 404);
    return NextResponse.json(requests, { status: 200 });
  }
);
