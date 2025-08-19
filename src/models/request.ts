import mongoose, { Document, Schema, Model } from "mongoose";

// Auth Configuration Type
export interface IAuthConfig {
  type: "none" | "bearer" | "basic" | "apikey" | "oauth2" | "digest";
  token?: string;
  username?: string;
  password?: string;
  key?: string;
  value?: string;
  addTo?: "header" | "query";
  clientId?: string;
  clientSecret?: string;
  accessTokenUrl?: string;
  scope?: string;
  realm?: string;
}

// Request Type
export interface IRequest extends Document {
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  url: string;
  headers: { key: string; value: string }[];
  params: { key: string; value: string }[];
  body?: {
    type: "raw" | "form" | "json";
    content: unknown;
  };
  auth?: IAuthConfig;
  folder: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Auth Configuration Schema
const AuthConfigSchema = new Schema<IAuthConfig>(
  {
    type: {
      type: String,
      enum: ["none", "bearer", "basic", "apikey", "oauth2", "digest"],
      default: "none",
    },
    token: String,
    username: String,
    password: String,
    key: String,
    value: String,
    addTo: {
      type: String,
      enum: ["header", "query"],
      default: "header",
    },
    clientId: String,
    clientSecret: String,
    accessTokenUrl: String,
    scope: String,
    realm: String,
  },
  { _id: false }
); // Disable _id for subdocument

// Request Schema
const RequestSchema = new Schema<IRequest>({
  name: { type: String, required: true },
  method: {
    type: String,
    enum: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    required: true,
  },
  url: { type: String, required: true },
  headers: [{ key: String, value: String }],
  params: [{ key: String, value: String }],
  body: Schema.Types.Mixed,
  auth: {
    type: AuthConfigSchema,
    default: { type: "none" },
  },
  folder: { type: Schema.Types.ObjectId, ref: "Folder", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Request: Model<IRequest> =
  mongoose.models.Request || mongoose.model<IRequest>("Request", RequestSchema);
