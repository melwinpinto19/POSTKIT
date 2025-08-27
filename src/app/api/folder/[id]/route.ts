import { Folder } from "@/models/folder";
import { Request } from "@/models/request";
import { asyncTryCatchWrapper, CustomApiError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

interface Context {
  params: { [key: string]: string };
}

// Get Folder by ID
export const GET = asyncTryCatchWrapper(
  async (
    _req: NextRequest,
    userId: mongoose.Types.ObjectId,
    { params }: Context
  ) => {
    const folder = await Folder.findOne({
      _id: params.id,
      createdBy: userId,
    });
    if (!folder) throw new CustomApiError("Folder not found", 404);
    return NextResponse.json(folder, { status: 200 });
  }
);

// Update Folder
export const PUT = asyncTryCatchWrapper(
  async (
    req: NextRequest,
    userId: mongoose.Types.ObjectId,
    { params }: Context
  ) => {
    const { name } = await req.json();
    const updated = await Folder.findOneAndUpdate(
      { _id: params.id, createdBy: userId },
      { name, updatedAt: Date.now() },
      { new: true }
    );
    if (!updated) throw new CustomApiError("Folder not found", 404);
    return NextResponse.json(updated, { status: 200 });
  }
);

// Delete Folder
export const DELETE = asyncTryCatchWrapper(
  async (
    _req: NextRequest,
    userId: mongoose.Types.ObjectId,
    { params }: Context
  ) => {
    // Delete all requests belonging to this folder
    await Request.deleteMany({ folder: params.id, createdBy: userId });

    // Delete the folder itself
    const deleted = await Folder.findOneAndDelete({
      _id: params.id,
      createdBy: userId,
    });
    if (!deleted) throw new CustomApiError("Folder not found", 404);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  }
);