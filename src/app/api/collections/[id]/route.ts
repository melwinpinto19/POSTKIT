import { Collection } from "@/models/collection";
import { asyncTryCatchWrapper, CustomApiError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

interface Context {
  params: { [key: string]: string };
}
// Get Collection by ID
export const GET = asyncTryCatchWrapper(
  async (
    _req: NextRequest,
    userId: mongoose.Types.ObjectId,
    { params }: Context
  ) => {
    const collection = await Collection.findOne({
      _id: params.id,
      createdBy: userId,
    }).lean();
    if (!collection) throw new CustomApiError("Collection not found", 404);
    return NextResponse.json(collection, { status: 200 });
  }
);

// Update Collection
export const PATCH = asyncTryCatchWrapper(
  async (
    req: NextRequest,
    userId: mongoose.Types.ObjectId,
    { params }: Context
  ) => {
    const { name, description } = await req.json();
    const updated = await Collection.findOneAndUpdate(
      { _id: params.id, createdBy: userId },
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
    const deleted = await Collection.findOneAndDelete({
      _id: params.id,
      createdBy: userId,
    });
    if (!deleted) throw new CustomApiError("Collection not found", 404);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  }
);
