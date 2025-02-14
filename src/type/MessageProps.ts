import { ConversationProps } from "./ConversationProps";
import { NotificationProps } from "./NotificationProps";

export type MessageProps = {
  id: string;
  // createdAt: Date;
  sentAt: Date;
  timeStamp: Date;
  updatedAt: Date;

  isRequest: boolean;
  isChat: boolean;

  content: string;
  file: string[];

  senderId: string;
  recipientId: string;
  conversationId: string;

  isRead: boolean;
  isSeen: boolean;
  isResponse: boolean;
  responseTime: number;

  sender: UserMessageProps;
  recipient: UserMessageProps;

  conversation: ConversationProps;

  notifications: NotificationProps[];
};
type UserMessageProps = {
  id: string;
  name: string;
  profile: {
    image: string;
  };
  isOnline: boolean;
  lastSeen: Date;
};
