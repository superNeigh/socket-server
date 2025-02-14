import express from "express";
import { createServer } from "http";
import { setupSocket } from "./config/socket";

const app = express();
const server = createServer(app);

// Configuration WebSocket
setupSocket(server);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
