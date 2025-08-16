import { connectDB } from "@/lib/db";
import { Request } from "@/models/request";
import { asyncTryCatchWrapper } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncTryCatchWrapper(async (request: NextRequest) => {
  await connectDB();

  const requests = await Request.find();
  return NextResponse.json({ message: "Success", data: requests });
});
