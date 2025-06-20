import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  name?: string;
  username?: string;
  email: string;
  civicId: string;
  bio?: string;
  type?: string;
  data?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String },
  username: { type: String },
  email: { type: String, required: true },
  civicId: { type: String, required: true },
  bio: { type: String },
  type: { type: String },
  data: { type: Schema.Types.ObjectId },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
