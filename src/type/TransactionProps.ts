import { ItemProps, Picture } from "./ItemProps";
import { RentalProps } from "./RentalProps";
import { UserProps } from "./UserProps";

export type TransactionStatus = "IN_PROGRESS" | "COMPLETED";

export type TransactionProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: TransactionStatus;
  paymentIntentId: string;

  amountEarned: number | null; // montant gagné par le propriétaire
  amountPaid: number | null; // montant payé par le loueur
  amountFee: number | null; // montant des frais de service
  pointsEarned: number | null; // points gagnés par le propriétaire
  amountRefunded: number | null; // montant remboursé
  amountWithdrawn: number | null; // montant retiré

  rentalId: string;
  itemId: string;
  renterId: string;
  ownerId: string;

  rental: RentalProps;
  item: ItemProps & { picture: Picture[] };
  renter: UserProps;
  owner: UserProps;
};
