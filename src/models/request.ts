import mongoose, { Document, Schema, Model } from "mongoose";

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
  folder: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

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
  folder: { type: Schema.Types.ObjectId, ref: "Folder", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Request: Model<IRequest> =
  mongoose.models.Request || mongoose.model<IRequest>("Request", RequestSchema);
