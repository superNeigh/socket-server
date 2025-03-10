import { Socket } from "socket.io";
import {
  getLastMessagesFromRoom,
  sortRoomMessagesByDate,
} from "../services/messageService";

import { MessageProps } from "../type/MessageProps";

export const joinRoomHandler = async (
  socket: Socket,
  roomId: string
  // previousRoomId: string
) => {
  // if (previousRoomId) {
  //   socket.leave(previousRoomId);
  // }

  socket.join(roomId);
  let messages = await getLastMessagesFromRoom(roomId);
  messages = await sortRoomMessagesByDate(messages as MessageProps[]);
  socket.emit("get-room-messages", messages);
};
