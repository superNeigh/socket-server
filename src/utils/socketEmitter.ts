import { Server, Socket } from "socket.io";
import { NotificationProps } from "../type/NotificationProps";
import { MessageProps } from "../type/MessageProps";

declare global {
  var io: Server | undefined;
}

export const getSocketServer = (): Server | undefined => {
  if (!global.io) {
    console.warn("IO server is not initialized yet.");
    return undefined;
  }
  return global.io;
};
export const emitNotification = (
  recipientId: string,
  event: string,
  notification: NotificationProps
) => {
  if (global.io) {
    global.io.to(recipientId).emit(event, notification);
    console.log(
      ">>>Emitted notification with event",
      event,
      "and data"
      // notification
    );
  } else {
    console.error(
      "Attempted to emit event without an initialized Socket.io server."
    );
  }
};
export const emitToAll = (event: string) => {
  if (global.io) {
    global.io.emit(event);
    console.log(">>>Emitted to all with event", event);
  } else {
    console.error(
      "Tentative d'émission d'un événement sans serveur Socket.io initialisé."
    );
  }
};

export const emitToRoom = (
  roomId: string,
  event: string,
  messages: MessageProps[]
) => {
  if (global.io) {
    global.io.to(roomId).emit(event, messages);
    console.log(
      ">>>Emitted to room",
      roomId,
      "with event",
      event,
      "and messages"
      // messages
    );
  } else {
    console.error(
      "Tentative d'émission d'un événement sans serveur Socket.io initialisé."
    );
  }
};

export const emitToReceiver = (receiverId: string, event: string) => {
  if (global.io) {
    global.io.to(receiverId).emit(event);
    console.log(">>>Emitted to receiver", receiverId, "with event", event);
  } else {
    console.error(
      "Tentative d'émission d'un événement sans serveur Socket.io initialisé."
    );
  }
};

export const emitToSender = (senderId: string, event: string) => {
  if (global.io) {
    global.io.to(senderId).emit(event);
    console.log(">>>Emitted to sender", senderId, "with event", event);
  } else {
    console.error(
      "Tentative d'émission d'un événement sans serveur Socket.io initialisé."
    );
  }
};

export const broadcastToRoom = (socket: Socket, event: string, data: any) => {
  if (global.io) {
    socket.broadcast.to(data.room).emit(event, data);
    console.log(
      ">>>Broadcasted to room",
      data.room,
      "with event",
      event,
      "and data",
      data
    );
  } else {
    console.error(
      "Attempted to broadcast event without an initialized Socket.io server."
    );
  }
};
