import { Collection } from "@/models/collection";
import { asyncTryCatchWrapper, CustomApiError } from "@/utils";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncTryCatchWrapper(
  async (request: NextRequest, userId: ObjectId) => {
    const { name, description } = await request.json();

    // Validate request body
    if (!name || !description) {
      throw new CustomApiError("Name and description are required", 400);
    }

    // Create a new collection
    const collection = await Collection.create({
      name,
      description,
      createdBy: userId,
    });

    // Check if collection was created successfully
    if (!collection) {
      throw new CustomApiError("Failed to create collection", 500);
    }

    // Return the created collection
    return NextResponse.json(
      {
        collection,
        message: "Collection created successfully",
      },
      { status: 201, statusText: "Collection created successfully" }
    );
  }
);
