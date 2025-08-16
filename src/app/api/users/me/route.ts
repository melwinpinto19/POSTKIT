import User from "@/models/user";
import { asyncTryCatchWrapper } from "@/utils";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncTryCatchWrapper(
  async (request: NextRequest, userId: ObjectId) => {
    // get the user data :
    const user = await User.findById(userId).select("-password");

    // return the user data
    return NextResponse.json({ message: "Success", data: user });
  }
);
