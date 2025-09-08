import { Server } from "socket.io";
import { ensureConversation } from "../controllers/chatController.js";
import { Message } from "../models/MessageModel.js";
import { botReply } from "./bot.service.js";

export const initSocket = (httpServer, origin) => {
  const io = new Server(httpServer, {
    cors: { origin, credentials: true }
  });

  io.on("connection", (socket) => {
    // client tells us its session
    socket.on("join", async ({ sessionId, userAgent }) => {
      socket.join(sessionId);
      await ensureConversation(sessionId, userAgent);
    });

    socket.on("client:message", async ({ sessionId, text }) => {
      const convo = await ensureConversation(sessionId, socket.handshake.headers["user-agent"]);

      const userMsg = await Message.create({
        conversation: convo._id,
        sender: "user",
        text
      });

      io.to(sessionId).emit("server:message", userMsg.toObject());

      const replyText = botReply(text);
      const botMsg = await Message.create({
        conversation: convo._id,
        sender: "bot",
        text: replyText
      });

      io.to(sessionId).emit("server:message", botMsg.toObject());
    });

    socket.on("disconnect", () => {});
  });

  return io;
};
