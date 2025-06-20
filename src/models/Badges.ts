import mongoose, { Schema, Document } from "mongoose";

export interface IBadge extends Document {
  name: string;
  description: string;
  url: string;
}

const BadgeSchema = new Schema<IBadge>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
});

export const Badge =
  mongoose.models.Badge || mongoose.model<IBadge>("Badges", BadgeSchema);
