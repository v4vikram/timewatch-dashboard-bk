import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    sender: { type: String, required: true }, // "user" | "bot" | userId
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
