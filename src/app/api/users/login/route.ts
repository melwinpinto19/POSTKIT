import User from "@/models/user";
import { asyncTryCatchWrapper, CustomApiError } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = asyncTryCatchWrapper(async (request: NextRequest) => {
  // get the body data:
  const { email, password } = await request.json();

  // validate the data:
  if (!email || !password) {
    throw new CustomApiError("Email and password are required", 400);
  }

  // check if the user exists :
  const user = await User.findOne({ email });

  // throw error if user does not exists with the specified email :
  if (!user) {
    throw new CustomApiError("User not found", 404);
  }

  // compare password :
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new CustomApiError("password is incorrect", 401);
  }

  // make the jwt token :
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET_TOKEN!,
    { expiresIn: "1h" }
  );

  // return the response:
  return NextResponse.json(
    { message: "Login successful", token },
    { status: 200, statusText: "Login successful" }
  );
});
