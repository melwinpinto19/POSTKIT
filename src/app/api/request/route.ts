import { Request } from "@/models/request";
import { asyncTryCatchWrapper, CustomApiError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Create Request
export const POST = asyncTryCatchWrapper(
  async (req: NextRequest, userId: mongoose.Types.ObjectId) => {
    const { name, method, url, folder } = await req.json();

    if (!name || !method || !folder || !url)
      throw new CustomApiError("Missing required fields", 400);

    const requestDoc = await Request.create({
      name,
      method,
      url,
      folder,
      createdBy: userId,
    });

    return NextResponse.json(requestDoc, { status: 201 });
  }
);

// Get All Requests
export const GET = asyncTryCatchWrapper(
  async (_req: NextRequest, userId: mongoose.Types.ObjectId) => {
    const requests = await Request.find({ createdBy: userId }).lean();
    return NextResponse.json(requests, { status: 200 });
  }
);
