// import { Server } from "socket.io";
// import { connectionHandler } from "../handlers/connectionHandler";
// import jwt from "jsonwebtoken";

// const SECRET_KEY = process.env.NEXTAUTH_SECRET as string;
// declare global {
//   var io: Server | undefined;
// }

// export const setupSocket = (server: any) => {
//   const io = new Server(server, {
//     cors: {
//       origin: process.env.CLIENT_URL as string,
//       credentials: true,
//     },
//     pingTimeout: 60000,
//     pingInterval: 25000,
//   });

//   global.io = io;

//   global.io.on("connection", (socket) => {
//     console.log(`⚡: Un utilisateur connecté ${socket.id}`);

//     // Récupérer le token envoyé via la connexion WebSocket auth
//     const token = socket.handshake.auth.token as string;
//     console.log("Token reçu :", token);
//     // Vérifier la validité du token JWT
//     if (!token) {
//       console.log("Token non trouvé");
//       socket.disconnect();
//       return;
//     }

//     try {
//       // Vérification du token
//       const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;

//       // Vérifier si l'expiration est définie
//       if (decoded.exp && decoded.exp < Date.now() / 1000) {
//         console.log("Token expiré, déconnexion...");
//         socket.emit("error", "Token expiré. Veuillez vous reconnecter.");
//         socket.disconnect();
//         return;
//       }

//       console.log("Utilisateur authentifié avec ID:", decoded.id);

//       // Passer l'ID utilisateur à connectionHandler
//       connectionHandler(socket, decoded.id as string);
//     } catch (error) {
//       console.error("Token invalide ou expiré", error);
//       socket.disconnect();
//     }

//     socket.on("disconnect", () => {
//       console.log("Utilisateur déconnecté");
//     });
//   });

//   return io;
// };
