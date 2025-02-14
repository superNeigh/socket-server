import { Server } from "socket.io";
import { connectionHandler } from "../handlers/connectionHandler";
import jwt from "jsonwebtoken"; // Assurez-vous d'installer le package 'jsonwebtoken' pour la vérification du token

const SECRET_KEY = process.env.JWT_SECRET_KEY || "votre_cle_secrete"; // Assurez-vous que la clé secrète soit définie dans .env

export const setupSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log(`⚡: Un utilisateur connecté ${socket.id}`);

    // Récupérer le token envoyé via la connexion WebSocket (query params)
    const token = socket.handshake.query.token as string;

    // Vérifier la validité du token JWT
    if (!token) {
      console.log("Token non trouvé");
      socket.disconnect();
      return;
    }

    try {
      // Vérification du token
      const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload; // Assure que c'est bien un objet JWT

      if (!decoded || typeof decoded !== "object" || !decoded.id) {
        throw new Error("Token invalide : ID utilisateur manquant");
      }

      console.log("Utilisateur authentifié avec ID:", decoded.id);
      // Passer l'ID utilisateur à connectionHandler
      connectionHandler(socket, decoded.id as string);
    } catch (error) {
      console.error("Token invalide ou expiré", error);
      socket.disconnect();
    }

    socket.on("disconnect", () => {
      console.log("Utilisateur déconnecté");
    });
  });

  return io;
};
