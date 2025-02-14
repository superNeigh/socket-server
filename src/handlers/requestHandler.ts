import {
  getLastMessagesFromRoom,
  sortRoomMessagesByDate,
} from "../services/messageService";
import { ConversationProps } from "../type/ConversationProps";
import { MessageProps } from "../type/MessageProps";
import { NotificationType } from "../type/NotificationProps";
import { RentalRequestProps } from "../type/RentalProps";

import { emitToRoom } from "../utils/socketEmitter";

import { notificationHandler } from "./notificationHandler";

export const requestHandler = async (
  message: MessageProps,
  rental: RentalRequestProps,
  conversation: ConversationProps
) => {
  const roomId = message.conversationId;

  try {
    if (conversation && conversation.isNewConversation && rental) {
      console.log(">>>Handling new conversation...");

      console.info(
        ">>> Handling message-room event for new conversation completed successfully."
      );
      const lastMessages = await getLastMessagesFromRoom(roomId);
      const sortedMessages = await sortRoomMessagesByDate(
        lastMessages as MessageProps[]
      );
      emitToRoom(roomId, "get-room-messages", sortedMessages);
      console.log(">>>>> 6.Emitted get-room-messages event to room:", roomId);

      await notificationHandler(
        message.senderId,
        message.recipientId,
        message.conversationId,
        NotificationType.RENTAL
      );
    }
  } catch (error) {
    console.error(
      "Erreur lors de la création du message de demande:",
      error,
      message,
      rental,
      conversation
    );
  }
};
