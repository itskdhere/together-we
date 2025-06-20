import mongoose, { Schema, Document, Types } from "mongoose";

export interface IConversation extends Document {
  user1: Types.ObjectId;
  user2: Types.ObjectId;
}

const ConversationSchema = new Schema<IConversation>({
  user1: { type: Schema.Types.ObjectId, ref: "User", required: true },
  user2: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Conversation =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversations", ConversationSchema);
