import { Folder } from "@/models/folder";
import { asyncTryCatchWrapper, CustomApiError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Create Folder
export const POST = asyncTryCatchWrapper(async (req: NextRequest, userId: mongoose.Types.ObjectId) => {
  const { name, collectionName } = await req.json();
  if (!name || !collectionName) throw new CustomApiError("Name and collectionName are required", 400);

  const folder = await Folder.create({
    name,
    collectionName,
    createdBy: userId,
  });

  return NextResponse.json(folder, { status: 201 });
});

// Get All Folders
export const GET = asyncTryCatchWrapper(async (_req: NextRequest, userId: mongoose.Types.ObjectId) => {
  const folders = await Folder.find({ createdBy: userId }).lean();
  return NextResponse.json(folders, { status: 200 });
});