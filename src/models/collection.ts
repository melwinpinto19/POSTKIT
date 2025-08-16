import mongoose, { Document, Schema, Model } from "mongoose";

// Collection Type
export interface ICollection extends Document {
  name: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Collection Schema
const CollectionSchema = new Schema<ICollection>({
  name: { type: String, required: true },
  description: String,
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Collection: Model<ICollection> =
  mongoose.models.Collection ||
  mongoose.model<ICollection>("Collection", CollectionSchema);
