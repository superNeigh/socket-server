import { Socket } from "socket.io";
import { emitToAll } from "../utils/socketEmitter";

export const disconnectHandler = async (
  socket: Socket,
  socketUserMap: Map<string, string>
) => {
  console.log("***User disconnected", socket.id);
  const userId = socketUserMap.get(socket.id);

  if (userId) {
    socketUserMap.delete(socket.id);
    console.log(`***User ${userId} disconnected`);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/updateUserStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            data: {
              isOnline: false,
              lastSeen: new Date(),
            },
          }),
        }
      );

      if (response.status === 200) {
        console.log(`***User ${userId} is offline in the database`);
        console.log(">>> SocketUserMap:", socketUserMap);
      } else {
        throw new Error("Échec de la mise à jour du statut de l'utilisateur");
      }

      emitToAll("get-current-user");
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut de l'utilisateur lors de la déconnexion:",
        error
      );
    }
  } else {
    console.error("Aucun utilisateur trouvé pour l'ID de socket:", socket.id);
  }
};
