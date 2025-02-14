import { MessageProps } from "./MessageProps";
import { RentalProps } from "./RentalProps";
export enum NotificationType {
  MESSAGE = "MESSAGE",
  RENTAL = "RENTAL",
  RENTALSTATUS = "RENTALSTATUS",
  RENTALPAYMENT = "RENTALPAYMENT",
  REVIEW = "REVIEW",
  REWARD = "REWARD",
  RENTER = "RENTER",
  OWNER = "OWNER",
}
export type NotificationProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: NotificationType;
  body: string;

  isSeen: boolean;

  conversationId: string;
  senderId: string;
  recipientId: string;

  rentalId: string | null;
  chatMessageId: string | null;

  sender: UserNotificationProps;
  recipient: UserNotificationProps;
  chatMessage?: MessageProps | null;
  rental?: RentalProps | null;
};

export type UserNotificationProps = {
  id: string;
  name: string;
  email: string;
  profile: {
    image: string | null;
  };
  settings: {
    mobileNotification: boolean;
    emailNotification: boolean;
  };
};

// Exemples de types pour les utilisateurs et les messages, si nécessaire
export interface MessageModel extends MessageProps {}
// export interface OrderModel extends Order {}
