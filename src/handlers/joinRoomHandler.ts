import { Socket } from "socket.io";
import {
  getLastMessagesFromRoom,
  sortRoomMessagesByDate,
} from "../services/messageService";

import { MessageProps } from "../type/MessageProps";

export const joinRoomHandler = async (
  socket: Socket,
  roomId: string,
  previousRoomId: string
) => {
  // console.log(`Event "join-room" reçu avec roomId: ${roomId} et previousRoomId: ${previousRoomId}`);

  if (previousRoomId) {
    socket.leave(previousRoomId);
  }

  socket.join(roomId);
  let messages = await getLastMessagesFromRoom(roomId);
  messages = await sortRoomMessagesByDate(messages as MessageProps[]);
  socket.emit("get-room-messages", messages);
};
