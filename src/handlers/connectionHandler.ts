import { Socket } from "socket.io";

import { joinRoomHandler } from "./joinRoomHandler";

import { messageHandler } from "./messageHandler";

import { requestHandler } from "./requestHandler";
import { disconnectHandler } from "./disconnectHandler";

import { notificationHandler } from "./notificationHandler";
import { requestStatusHandler } from "./rentalStatusHandler";
import { emitToAll } from "../utils/socketEmitter";
import { ConversationProps } from "../type/ConversationProps";
import { MessageProps } from "../type/MessageProps";
import { NotificationType } from "../type/NotificationProps";
import { RentalRequestProps, RequestStatus } from "../type/RentalProps";

const socketUserMap = new Map<string, string>();

export const connectionHandler = async (socket: Socket, userId: string) => {
  console.log(
    `>>>1. Nouvelle connexion de socket: ${socket.id} depuis ${socket.handshake.address}`
  );

  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.log("Token non trouvé");
      socket.emit("error", "Unauthorized");
      socket.disconnect();
      return;
    }

    const currentUserId = userId;
    if (!currentUserId) {
      console.error("ID utilisateur non trouvé");
      socket.emit("error", "Unauthorized");
      socket.disconnect();
      return;
    }

    // Déconnecter les anciens sockets de cet utilisateur
    for (let [socketId, userId] of socketUserMap.entries()) {
      if (userId === currentUserId) {
        const oldSocket = socket.nsp.sockets.get(socketId);
        if (oldSocket) {
          oldSocket.disconnect();
        }
      }
    }

    socketUserMap.set(socket.id, currentUserId);
    console.log(`>>> SocketUserMap:`, socketUserMap);

    console.log(`***Socket Join avec ID utilisateur: ${currentUserId}`);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/updateUserStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUserId,
            data: {
              isOnline: true,
              lastSeen: new Date(),
            },
          }),
        }
      );

      if (response.status === 200) {
        console.log(`***User ${currentUserId} is online in the database`);
      } else {
        throw new Error("Échec de la mise à jour du statut de l'utilisateur");
      }

      socket.join(currentUserId);
      emitToAll("get-current-user");
    } catch (error) {
      console.error(
        "Échec de la mise à jour du statut de l'utilisateur:",
        error
      );
      socket.disconnect(true);
    }

    // Gestion des événements
    socket.on(
      "sent-notification",
      async (
        type: NotificationType,
        senderId,
        recipientId,
        conversationId,
        body?: string
      ) => {
        if (senderId !== recipientId) {
          notificationHandler(
            senderId,
            recipientId,
            conversationId,
            type,
            body
          );
        }
      }
    );

    socket.on("join-room", async (roomId: string, previousRoomId: string) => {
      joinRoomHandler(socket, roomId, previousRoomId);

      // Mettez à jour les utilisateurs actifs dans le contexte
      socket
        .to(roomId)
        .emit("update-active-users", roomId, socketUserMap.get(socket.id));
    });

    socket.on("leave-room", (roomId: string) => {
      socket.leave(roomId);

      // Mettez à jour les utilisateurs actifs dans le contexte
      socket
        .to(roomId)
        .emit(
          "update-active-users",
          roomId,
          socketUserMap.get(socket.id),
          true
        );
    });

    socket.on("chat-message", async (message: MessageProps) =>
      messageHandler(message)
    );

    socket.on(
      "request-message",
      async (
        message: MessageProps,
        rental: RentalRequestProps,
        conversation: ConversationProps
      ) => requestHandler(message, rental, conversation)
    );

    socket.on(
      "change-request-status",
      async (
        rentalId: string,
        status: RequestStatus,
        messageId: string,
        conversation: ConversationProps
      ) =>
        requestStatusHandler(socket, rentalId, status, messageId, conversation)
    );

    socket.on("disconnect", async () =>
      disconnectHandler(socket, socketUserMap)
    );
  } catch (error) {
    console.error("Erreur lors de la gestion de la connexion:", error);
    socket.emit("error", "Server Error");
    socket.disconnect();
  }
};
