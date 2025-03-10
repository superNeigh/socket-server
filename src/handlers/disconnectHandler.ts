import { Socket } from "socket.io";
import db from "../services/db";
import { emitToAll } from "../utils/socketEmitter";

export const disconnectHandler = async (
  socket: Socket,
  socketUserMap: Map<string, string>
) => {
  const userId = socketUserMap.get(socket.id);

  if (userId) {
    // Suppression de l'utilisateur dans la Map
    socketUserMap.delete(socket.id);
    console.log(
      `🔴 [disconnectHandler] ***User ${userId} disconnected from socket ${socket.id}`
    );

    // Vérification s'il y a encore des connexions ouvertes pour cet utilisateur
    const remainingSockets = [...socketUserMap.values()].filter(
      (id) => id === userId
    ).length;

    if (remainingSockets === 0) {
      // Aucune autre connexion active pour cet utilisateur, mettre à jour le statut
      try {
        const updatedUser = await db.user.update({
          where: { id: userId },
          data: {
            isOnline: false,
            lastSeen: new Date(),
          },
        });
        console.log(
          `✅ [disconnectHandler] ***User ${userId} is offline in the database`
        );
        emitToAll("get-current-user");
      } catch (error) {
        console.error(
          "❌ [disconnectHandler] Error while updating user status on disconnect:",
          error
        );
      }
    } else {
      console.log(
        `🟢 [disconnectHandler] ***User ${userId} still has active connections`
      );
    }
  } else {
    console.log(
      `❓ [disconnectHandler] No user found for socket ID: ${socket.id}`
    );
  }
};
