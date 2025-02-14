import express from "express";
import { createServer } from "http";
import { setupSocket } from "./config/socket";
import cors from "cors";

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_URL as string,
    credentials: true,
    methods: ["GET", "POST"],
  })
);

// Configuration WebSocket
setupSocket(server);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
