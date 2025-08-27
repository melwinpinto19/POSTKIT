export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message: string;
}

export interface UserProfileResponse {
  message: string;
  data: {
    _id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}
