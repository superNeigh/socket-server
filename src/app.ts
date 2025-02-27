import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import { connectionHandler } from "./handlers/connectionHandler";

const app = express();
app.use(cors());

const SECRET_KEY = process.env.JWT_SECRET as string;

export const setupSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL as string,
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log(`⚡: Un utilisateur connecté ${socket.id}`);

    const token = socket.handshake.auth.token as string;
    if (!token) {
      console.log("❌ Missing Token");
      socket.emit("auth_error", "Missing Token.");
      return socket.disconnect();
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;

      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        console.log("⏳ Token expired, disconnection...");
        socket.emit("auth_error", "Token expired. Please log in again.");
        return socket.disconnect();
      }

      console.log("✅ User authenticated with ID:", decoded.id);
      connectionHandler(socket, decoded.id as string);
    } catch (error) {
      console.error("❌ Token invalide", error);
      socket.emit("auth_error", "Token invalide.");
      return socket.disconnect();
    }

    socket.on("disconnect", () => {
      console.log(`🔴 User ${socket.id} disconnected`);
    });
  });

  return io;
};

export default app;
