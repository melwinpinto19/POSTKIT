import { Collection } from "@/models/collection";
import { asyncTryCatchWrapper, CustomApiError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Create Collection
export const POST = asyncTryCatchWrapper(async (req: NextRequest, userId: mongoose.Types.ObjectId) => {
  const { name, description } = await req.json();
  if (!name) throw new CustomApiError("Name is required", 400);

  const collection = await Collection.create({
    name,
    description,
    createdBy: userId,
  });

  return NextResponse.json(collection, { status: 201 });
});

// Get All Collections
export const GET = asyncTryCatchWrapper(async (_req: NextRequest, userId: mongoose.Types.ObjectId) => {
  const collections = await Collection.find({ createdBy: userId }).lean();
  return NextResponse.json(collections, { status: 200 });
});

