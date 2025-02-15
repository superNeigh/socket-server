import http from "http";
import dotenv from "dotenv";
import app, { setupSocket } from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;

// Création du serveur HTTP avec Express
const server = http.createServer(app);

// Configuration de Socket.io
setupSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Serveur WebSocket lancé sur http://localhost:${PORT}`);
});
