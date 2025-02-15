import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import { connectionHandler } from "./handlers/connectionHandler";

const app = express();

app.use(cors());

const SECRET_KEY = process.env.JWT_SECRET as string;
declare global {
  var io: Server | undefined;
}

export const setupSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL as string,
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  global.io = io;

  io.on("connection", (socket) => {
    console.log(`⚡: Un utilisateur connecté ${socket.id}`);

    const token = socket.handshake.auth.token as string;
    console.log("Token reçu :", token);

    if (!token) {
      console.log("Token manquant");
      socket.disconnect();
      return;
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;

      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        console.log("Token expiré, déconnexion...");
        socket.emit("error", "Token expiré. Veuillez vous reconnecter.");
        socket.disconnect();
        return;
      }

      console.log("Utilisateur authentifié avec ID:", decoded.id);

      // Gérer la connexion de l'utilisateur
      connectionHandler(socket, decoded.id as string);
    } catch (error) {
      console.error("Token invalide", error);
      socket.disconnect();
    }

    socket.on("disconnect", () => {
      console.log("Utilisateur déconnecté");
    });
  });

  return io;
};

export default app;
