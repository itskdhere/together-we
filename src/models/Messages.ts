import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  conversationId?: Types.ObjectId[];
  content: string;
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  conversationId: [{ type: Schema.Types.ObjectId, ref: "Conversations" }],
  content: { type: String, required: true },
});

export const Message =
  mongoose.models.Message ||
  mongoose.model<IMessage>("Messages", MessageSchema);
