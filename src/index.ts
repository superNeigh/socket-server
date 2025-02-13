const express = require("express");
import { Server } from "socket.io";
import { createServer } from "http";
const server = createServer();
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  })
);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`⚡: Un utilisateur connecté ${socket.id}`);

  socket.on("chat-message", (msg) => {
    console.log("Message reçu :", msg);
    io.emit("chat-message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur WebSocket lancé sur le port ${PORT}`);
});
