import { RentalProps } from "./RentalProps";
import { UserProps } from "./UserProps";

export type ReviewProps = {
  id: string;
  createdAt: Date;
  stars: number;
  comment: string | null;
  itemId: string;
  rentalId: string;
  transactionId: string;
  reviewerId: string;
  revieweeId: string;
  rental: RentalProps;
  reviewer: UserProps;
  reviewee: UserProps;
};
