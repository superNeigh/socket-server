require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
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
