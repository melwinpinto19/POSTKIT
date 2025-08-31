import { Collection } from "@/models/collection";
import { Folder } from "@/models/folder";
import { Request } from "@/models/request";
import { asyncTryCatchWrapper, CustomApiError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

interface Context {
  params: Promise<{ [key: string]: string }>;
}
// Get Collection by ID
export const GET = asyncTryCatchWrapper(
  async (
    _req: NextRequest,
    userId: mongoose.Types.ObjectId,
    { params }: Context
  ) => {
    const { id } = await params;
    const collection = await Collection.findOne({
      _id: id,
      createdBy: userId,
    }).lean();
    if (!collection) throw new CustomApiError("Collection not found", 404);
    return NextResponse.json(collection, { status: 200 });
  }
);

// Update Collection
export const PUT = asyncTryCatchWrapper(
  async (
    req: NextRequest,
    userId: mongoose.Types.ObjectId,
    { params }: Context
  ) => {
    const { id } = await params;
    const { name, description } = await req.json();
    const updated = await Collection.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { name, description, updatedAt: Date.now() },
      { new: true }
    );
    if (!updated) throw new CustomApiError("Collection not found", 404);
    return NextResponse.json(updated, { status: 200 });
  }
);

// Delete Collection
export const DELETE = asyncTryCatchWrapper(
  async (
    _req: NextRequest,
    userId: mongoose.Types.ObjectId,
    { params }: Context
  ) => {
    const { id } = await params;
    // Find all folders belonging to this collection
    const folders = await Folder.find({
      collectionName: id,
      createdBy: userId,
    }).lean();

    // Delete all requests belonging to these folders
    const folderIds = folders.map((f) => f._id);
    if (folderIds.length > 0) {
      await Request.deleteMany({
        folder: { $in: folderIds },
        createdBy: userId,
      });
    }

    // Delete all folders belonging to this collection
    await Folder.deleteMany({ collectionName: id, createdBy: userId });

    // Delete the collection itself
    const deleted = await Collection.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });
    if (!deleted) throw new CustomApiError("Collection not found", 404);

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  }
);
