import asyncHandler from "express-async-handler";
import { Conversation } from "../models/ConversationModel.js";
import { Message } from "../models/MessageModel.js";
import { botReply } from "../services/bot.service.js";

import ChatMessage from "../models/chatMessageModel.js";

// Send a new message
export const sendMessage = async (req, res, next) => {
  try {
    const { sessionId, sender, text } = req.body;
    const message = await ChatMessage.create({ sessionId, sender, text });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

// Get chat history
export const getHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

// Get one message
export const getMessageById = async (req, res, next) => {
  try {
    const message = await ChatMessage.findById(req.params.messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json(message);
  } catch (err) {
    next(err);
  }
};

// Update a message
export const updateMessage = async (req, res, next) => {
  try {
    const updated = await ChatMessage.findByIdAndUpdate(
      req.params.messageId,
      { text: req.body.text },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Message not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete a message
export const deleteMessage = async (req, res, next) => {
  try {
    const deleted = await ChatMessage.findByIdAndDelete(req.params.messageId);
    if (!deleted) return res.status(404).json({ error: "Message not found" });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
