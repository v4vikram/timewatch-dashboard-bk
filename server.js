import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000", // frontend dev
      "http://localhost:3002",
      "https://preview.timewatchindia.com",
      "https://timewatch2-0-311005204045.europe-west1.run.app",
      "https://timewatch-dashboard-fd-311005204045.europe-west1.run.app",
    ],
    credentials: true,
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("message", (msg) => {
    console.log("💬 Message received:", msg);
    io.emit("message", msg); // broadcast to all
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
