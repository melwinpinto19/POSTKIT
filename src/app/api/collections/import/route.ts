import { NextRequest, NextResponse } from "next/server";
import { Collection } from "@/models/collection";
import { Folder } from "@/models/folder";
import { Request } from "@/models/request";
import { asyncTryCatchWrapper, CustomApiError } from "@/utils/index";
import { ObjectId } from "mongodb";
import { Collection as CollectionType } from "@/types/sidebar";

interface ImportRequest {
  name: string;
  method: string;
  url: string;
  headers?: Array<{ key: string; value: string }>;
  body?: any;
  params?: Array<{ key: string; value: string }>;
  auth?: any;
}

interface ImportFolder {
  name: string;
  requests: ImportRequest[];
}

interface ImportData {
  name: string;
  description?: string;
  version?: string;
  exportedAt?: string;
  folders: ImportFolder[];
}

export const POST = asyncTryCatchWrapper(
  async (request: NextRequest, userId: ObjectId) => {
    try {
      const importData: ImportData = await request.json();

      // Validate import data structure
      if (!importData.name || !Array.isArray(importData.folders)) {
        throw new CustomApiError("Invalid import data format", 400);
      }

      // Check if collection with same name already exists
      const existingCollection = await Collection.findOne({
        name: importData.name,
        createdBy: userId,
      });

      let collectionName = importData.name;
      if (existingCollection) {
        // Append timestamp to make it unique
        const timestamp = new Date().getTime();
        collectionName = `${importData.name} (Imported ${timestamp})`;
      }

      // Create the collection
      const newCollection = await Collection.create({
        name: collectionName,
        description: importData.description || "Imported collection",
        createdBy: userId,
      });

      const importStats = {
        foldersCreated: 0,
        requestsCreated: 0,
      };

      // Process each folder in the collection
      for (const folderData of importData.folders) {
        // Create folder inside the collection
        const newFolder = await Folder.create({
          name: folderData.name,
          collectionName: newCollection._id, // Reference to collection
          createdBy: userId,
        });

        importStats.foldersCreated++;

        // Create requests inside this folder
        for (const requestData of folderData.requests) {
          await Request.create({
            name: requestData.name,
            method: requestData.method,
            url: requestData.url,
            headers: requestData.headers || [],
            body: requestData.body || {},
            params: requestData.params || [],
            auth: requestData.auth || {},
            folder: newFolder._id, // Reference to folder
            createdBy: userId,
          });

          importStats.requestsCreated++;
        }
      }

      // Fetch the complete imported structure to return
      const importedCollection = await Collection.findById(newCollection._id);
      const folders = await Folder.find({
        collectionName: newCollection._id,
      });

      // Build the response data matching sidebar types
      const foldersWithRequests = await Promise.all(
        folders.map(async (folder) => {
          const requests = await Request.find({
            folder: folder._id,
          });

          return {
            _id: (folder._id as ObjectId).toString(),
            name: folder.name,
            requests: requests.map((req) => ({
              _id: (req._id as ObjectId).toString(),
              name: req.name,
              method: req.method,
              url: req.url,
            })),
          };
        })
      );

      // Structure the response to match CollectionType from sidebar
      const responseCollection: CollectionType = {
        _id: (importedCollection!._id as ObjectId).toString(),
        name: importedCollection!.name,
        description: importedCollection!.description,
        folders: foldersWithRequests,
      };

      return NextResponse.json({
        message: "Collection imported successfully",
        data: {
          collection: responseCollection,
          stats: importStats,
        },
      });
    } catch (error) {
      console.error("Import error:", error);

      if (error instanceof SyntaxError) {
        throw new CustomApiError("Invalid JSON format", 400);
      }

      throw error;
    }
  }
);