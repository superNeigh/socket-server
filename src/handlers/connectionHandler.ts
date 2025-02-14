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
import db from "../services/db";

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
      // Mise à jour du statut de l'utilisateur lors de la connexion
      const updatedUser = await db.user.update({
        where: { id: currentUserId },
        data: {
          isOnline: true,
          lastSeen: new Date(),
        },
      });
      console.log(`***User ${currentUserId} is online in the database`);

      // Joindre la room avec l'ID utilisateur pour le chat
      socket.join(currentUserId);

      // Mettre à jour tous les autres clients
      emitToAll("get-current-user");
    } catch (error) {
      console.error(
        "Échec de la mise à jour du statut utilisateur dans la DB",
        error
      );
    } finally {
      socket.join(currentUserId);
      emitToAll("get-current-user");
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
        try {
          if (senderId !== recipientId) {
            notificationHandler(
              senderId,
              recipientId,
              conversationId,
              type,
              body
            );
          }
        } catch (error) {
          console.error("Erreur lors de l'envoi de la notification:", error);
          socket.emit("error", "Server Error");
        }
      }
    );

    socket.on("join-room", async (roomId: string, previousRoomId: string) => {
      try {
        joinRoomHandler(socket, roomId, previousRoomId);
        socket
          .to(roomId)
          .emit("update-active-users", roomId, socketUserMap.get(socket.id));
      } catch (error) {
        console.error("Erreur lors de la connexion à la salle:", error);
        socket.emit("error", "Server Error");
      }
    });

    socket.on("leave-room", (roomId: string) => {
      try {
        socket.leave(roomId);
        socket
          .to(roomId)
          .emit(
            "update-active-users",
            roomId,
            socketUserMap.get(socket.id),
            true
          );
      } catch (error) {
        console.error("Erreur lors de la déconnexion de la salle:", error);
        socket.emit("error", "Server Error");
      }
    });

    socket.on("chat-message", async (message: MessageProps) => {
      try {
        await messageHandler(message);
      } catch (error) {
        console.error("Erreur dans le traitement du message:", error);
        socket.emit(
          "error",
          "Une erreur est survenue lors de l'envoi du message."
        );
      }
    });

    socket.on(
      "request-message",
      async (
        message: MessageProps,
        rental: RentalRequestProps,
        conversation: ConversationProps
      ) => {
        try {
          requestHandler(message, rental, conversation);
        } catch (error) {
          console.error("Erreur dans le traitement de la demande:", error);
          socket.emit(
            "error",
            "Une erreur est survenue lors de l'envoi de la demande."
          );
        }
      }
    );

    socket.on(
      "change-request-status",
      async (
        rentalId: string,
        status: RequestStatus,
        messageId: string,
        conversation: ConversationProps
      ) => {
        try {
          requestStatusHandler(
            socket,
            rentalId,
            status,
            messageId,
            conversation
          );
        } catch (error) {
          console.error("Erreur dans le traitement de la demande:", error);
          socket.emit(
            "error",
            "Une erreur est survenue lors de l'envoi de la demande."
          );
        }
      }
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
