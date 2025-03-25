import { Rental, User } from "@prisma/client";

export type ReviewProps = {
  id: string;
  createdAt: Date;
  rating: number;
  emoji: EmojiProps | null;
  comment: string | null;
  itemId: string;
  rentalId: string;
  transactionId: string;
  reviewerId: string;
  userId: string;
  rental: Rental;
  reviewer: User;
  user: User;
};
export type EmojiProps = {
  text: string;
  src: string;
};
