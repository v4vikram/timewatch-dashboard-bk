import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    sender: { type: String, enum: ["user", "bot", "agent"], required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", MessageSchema);
