import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrganization extends Document {
  category?: string;
  locality?: string;
  events?: Types.ObjectId[];
}

const OrganizationSchema = new Schema<IOrganization>({
  category: { type: String },
  locality: { type: String },
  events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});

export const Organization =
  mongoose.models.Organization ||
  mongoose.model<IOrganization>("Organization", OrganizationSchema);
