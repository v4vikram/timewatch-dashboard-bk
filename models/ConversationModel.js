import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, index: true, unique: true },
    userAgent: String
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", ConversationSchema);
