import {
  getLastMessagesFromRoom,
  sortRoomMessagesByDate,
} from "../services/messageService";
import { updateUserAverageResponseTime } from "../services/userService";
import { MessageProps } from "../type/MessageProps";

import { emitToReceiver, emitToRoom } from "../utils/socketEmitter";

export const messageHandler = async (message: MessageProps) => {
  const roomId = message.conversationId;
  console.log(
    `**Nouveau message de chat reçu de l'utilisateur ${message.senderId} dans la salle ${roomId}`
  );

  if (!message || !roomId || !message.senderId) {
    console.error("Message, roomId, ou userId invalide");
    return;
  }

  try {
    console.log(
      `**Nouveau chat message créé dans la salle: ${roomId} newMessage: ${message.content}`
    );

    let roomMessages = await getLastMessagesFromRoom(roomId);
    roomMessages = await sortRoomMessagesByDate(roomMessages);
    emitToRoom(roomId, "get-room-messages", roomMessages);

    await updateUserAverageResponseTime(message.senderId);

    emitToReceiver(message.recipientId, "get-current-user");
  } catch (error) {
    console.error("Erreur lors de la création du message de chat:", error);
  }
};
