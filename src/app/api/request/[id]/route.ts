import { Request } from "@/models/request";
import { asyncTryCatchWrapper, CustomApiError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

interface Context {
  params: { [key: string]: string };
}

// Get Request by ID
export const GET = asyncTryCatchWrapper(
  async (
    _req: NextRequest,
    userId: mongoose.Types.ObjectId,
    { params }: Context
  ) => {
    const requestDoc = await Request.findOne({
      _id: params.id,
      createdBy: userId,
    }).lean();
    if (!requestDoc) throw new CustomApiError("Request not found", 404);
    return NextResponse.json(requestDoc, { status: 200 });
  }
);

// Update Request
export const PATCH = asyncTryCatchWrapper(
  async (
    req: NextRequest,
    userId: mongoose.Types.ObjectId,
    { params }: Context
  ) => {
    const {
      name,
      method,
      url,
      headers,
      params: reqParams,
      body,
      auth,
    } = await req.json();
    const updated = await Request.findOneAndUpdate(
      { _id: params.id, createdBy: userId },
      {
        name,
        method,
        url,
        headers,
        params: reqParams,
        body,
        auth,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    if (!updated) throw new CustomApiError("Request not found", 404);
    return NextResponse.json(updated, { status: 200 });
  }
);

// Delete Request
export const DELETE = asyncTryCatchWrapper(
  async (
    _req: NextRequest,
    userId: mongoose.Types.ObjectId,
    { params }: Context
  ) => {
    const deleted = await Request.findOneAndDelete({
      _id: params.id,
      createdBy: userId,
    });
    if (!deleted) throw new CustomApiError("Request not found", 404);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  }
);
