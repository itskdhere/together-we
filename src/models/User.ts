import mongoose, { Schema, Document, Types } from "mongoose";

export enum UserType {
  Volunteer = "volunteer",
  Organization = "organization",
}

export interface IUser extends Document {
  name?: string;
  username?: string;
  email: string;
  civicId: string;
  onboarded: boolean;
  bio?: string;
  type?: UserType;
  data?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String },
  username: { type: String },
  email: { type: String, required: true },
  civicId: { type: String, required: true },
  onboarded: { type: Boolean, default: false },
  bio: { type: String },
  type: { type: String, enum: Object.values(UserType) },
  data: { type: Schema.Types.ObjectId },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
