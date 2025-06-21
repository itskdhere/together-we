import mongoose, { Schema, Document, Types } from "mongoose";

export interface IVolunteer extends Document {
  skills?: string;
  experience?: Types.ObjectId[];
  badges?: Types.ObjectId[];
}

const VolunteerSchema = new Schema<IVolunteer>({
  skills: { type: String },
  experience: [{ type: Schema.Types.ObjectId, ref: "Experience" }],
  badges: [{ type: Schema.Types.ObjectId, ref: "Badges" }],
});

export const Volunteer =
  mongoose.models.Volunteer ||
  mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);
