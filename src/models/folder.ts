import mongoose, { Document, Schema, Model } from "mongoose";

// Folder Type
export interface IFolder extends Document {
  name: string;
  collectionName: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Folder Schema
const FolderSchema = new Schema<IFolder>({
  name: { type: String, required: true },
  collectionName: {
    type: Schema.Types.ObjectId,
    ref: "Collection",
    required: true,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Folder: Model<IFolder> =
  mongoose.models.Folder || mongoose.model<IFolder>("Folder", FolderSchema);
