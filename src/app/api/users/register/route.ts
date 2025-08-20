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

  // check if the user already exists :
  const user = await User.findOne({ email });

  // throw error if user exists with same email :
  if (user) {
    throw new CustomApiError("User already exists", 409);
  }

  // hash the password :
  const hashedPassword = await bcrypt.hash(password, 10);

  // create the user :
  const newUser = await User.create({ email, password: hashedPassword });

  // make the jwt token :
  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    process.env.JWT_SECRET_TOKEN!,
    { expiresIn: "1h" }
  );

  // return the response:
  return NextResponse.json(
    { message: "Registration successful", token },
    { status: 201, statusText: "Registration successful" }
  );
});
