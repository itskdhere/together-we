import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEvent extends Document {
  name: string;
  description: string;
  volunteerCap: number;
  location: string;
  requiredSkills: string;
  startTime: Date;
  endTime: Date;
  joinedVolunteers?: Types.ObjectId[];
}

const EventSchema = new Schema<IEvent>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  volunteerCap: { type: Number, required: true },
  location: { type: String, required: true },
  requiredSkills: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  joinedVolunteers: [{ type: Schema.Types.ObjectId, ref: "Volunteers" }],
});

export const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Events", EventSchema);
