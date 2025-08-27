import { AxiosRequestHeaders } from "axios";
import { ApiResponse, instance } from "./apiHandler";
import { AuthFormData } from "@/types/auth";
import {
  AuthRequest,
  AuthResponse,
  UserProfileResponse,
} from "@/types/api/user";

// Login user
export const loginUser = async (
  data: AuthRequest
): Promise<ApiResponse<AuthResponse>> => {
  return await instance.post(
    "/users/login",
    data,
    {} as AxiosRequestHeaders,
    false // Don't require auth for login
  );
};

// Register user
export const registerUser = async (
  data: AuthRequest
): Promise<ApiResponse<AuthResponse>> => {
  return await instance.post(
    "/users/register",
    data,
    {} as AxiosRequestHeaders,
    false // Don't require auth for register
  );
};

// Get current user profile
export const getCurrentUser = async (): Promise<
  ApiResponse<UserProfileResponse>
> => {
  return await instance.get(
    "/users/me",
    {},
    {} as AxiosRequestHeaders,
    true // Requires auth
  );
};
