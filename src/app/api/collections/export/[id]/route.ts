import { NextRequest, NextResponse } from "next/server";
import { Collection } from "@/models/collection";
import { Folder } from "@/models/folder";
import { Request } from "@/models/request";
import { asyncTryCatchWrapper, CustomApiError } from "@/utils/index";
import { ObjectId } from "mongodb";

export const GET = asyncTryCatchWrapper(
  async (
    request: NextRequest,
    userId: ObjectId,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const collectionId = (await params).id;

    // Validate collection ID
    if (!ObjectId.isValid(collectionId)) {
      throw new CustomApiError("Invalid collection ID", 400);
    }

    // Get the collection
    const collection = await Collection.findOne({
      _id: collectionId,
      createdBy: userId,
    });

    if (!collection) {
      throw new CustomApiError("Collection not found", 404);
    }

    // Get all folders in the collection
    const folders = await Folder.find({
      collectionName: collectionId,
    }).lean();

    // Get all requests for each folder
    const exportData = {
      name: collection.name,
      description: collection.description,
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      folders: await Promise.all(
        folders.map(async (folder) => {
          const requests = await Request.find({
            folder: folder._id,
          }).lean();

          return {
            name: folder.name,
            requests: requests.map((req) => ({
              name: req.name,
              method: req.method,
              url: req.url,
              headers: req.headers || [],
              body: req.body || {},
              params: req.params || [],
              auth: req.auth || {},
            })),
          };
        })
      ),
      // Also include requests that are directly in the collection (not in folders)
      requests: await Request.find({
        collection: collectionId,
        folder: { $exists: false },
      })
        .lean()
        .then((requests) =>
          requests.map((req) => ({
            name: req.name,
            method: req.method,
            url: req.url,
            headers: req.headers || [],
            body: req.body || {},
            params: req.params || [],
            auth: req.auth || {},
          }))
        ),
    };

    // Set headers for file download
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set(
      "Content-Disposition",
      `attachment; filename="${collection.name
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_export.json"`
    );

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers,
    });
  }
);
