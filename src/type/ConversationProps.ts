import { RentalRequestProps } from "./RentalProps";
import { MessageProps } from "./MessageProps";

export type ConversationProps = {
  id: string;
  createdAt: Date;
  lastMessageAt: Date;

  isNewConversation: boolean;
  name: string;

  itemId: string;
  rentalId: string | null;
  requesterId: string;
  receiverId: string;

  requester: ItemUserProps;
  receiver: ItemUserProps;

  item: ItemRoomProps;
  rental: RentalRequestProps | null;
  messages: MessageProps[] | null;
};
type ItemRoomProps = {
  id: string;
  title: string;
  picture: { url: string }[] | null;
  price: number;
  category: { image: string | null };
};
export type ItemUserProps = {
  id: string;
  name: string;
  profile: { image: string | null };
  isOnline: boolean;
  lastSeen: Date | null;
};
