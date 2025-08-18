import { NextRequest, NextResponse } from "next/server";
import mongoose, { ObjectId } from "mongoose";
import { Collection } from "@/models/collection";
import { Folder } from "@/models/folder";
import { Request } from "@/models/request";
import User from "@/models/user";
import { asyncTryCatchWrapper } from "@/utils";

export const GET = asyncTryCatchWrapper(
  async (req: NextRequest, userId: ObjectId) => {
    // Find all collections for the user
    const collections = await Collection.find({ createdBy: userId }).lean();

    // For each collection, find folders and requests
    const collectionsWithFolders = await Promise.all(
      collections.map(async (collection) => {
        // Find folders for this collection
        const folders = await Folder.find({
          collectionName: collection._id,
        }).lean();

        // For each folder, find requests
        const foldersWithRequests = await Promise.all(
          folders.map(async (folder) => {
            const requests = await Request.find({ folder: folder._id }).lean();
            return {
              ...folder,
              requests,
            };
          })
        );

        return {
          ...collection,
          folders: foldersWithRequests,
        };
      })
    );

    return NextResponse.json(collectionsWithFolders, { status: 200 });
  }
);
