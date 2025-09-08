import { Router } from "express";
import { deleteMessage, getHistory, getMessageById, sendMessage, updateMessage } from "../controllers/chatController.js";

const router = Router();

// Get full chat history by session
router.get("/history/:sessionId", getHistory);

// Send a new message
router.post("/send", sendMessage);

// Get single message by ID
router.get("/:messageId", getMessageById);

// Update a message (e.g. edit text) 
router.put("/:messageId", updateMessage);

// Delete a message
router.delete("/:messageId", deleteMessage);

export default router;
