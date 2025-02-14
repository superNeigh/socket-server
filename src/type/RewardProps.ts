import { RentalProps } from "./RentalProps";
import { UserProps } from "./UserProps";

export type RewardProps = {
  id: string;
  createdAt: Date;
  points: number;
  comment: string;
  rentalId: string;
  renterId: string;
  renter: UserProps;
  rental: RentalProps;
};
