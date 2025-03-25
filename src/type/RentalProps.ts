import { RentalStatus, RequestStatus, UserMatchStatus } from "@prisma/client";
import { ReviewProps } from "./ReviewProps";
import { RewardProps } from "./RewardProps";
import { TransactionProps } from "./TransactionProps";
import { UserCardProps } from "./UserProps";

// export enum RequestStatus {
//   SENT = "SENT",
//   ACCEPTED = "ACCEPTED",
//   DECLINED = "DECLINED",
//   CANCELED = "CANCELED",
//   PAID = "PAID",
// }

// export enum RentalStatus {
//   PENDING = "PENDING",
//   UPCOMING = "UPCOMING",
//   IN_PROGRESS = "IN_PROGRESS",
//   ACTION_REQUIRED = "ACTION_REQUIRED",
//   COMPLETED = "COMPLETED",
// }

// export enum UserMatchStatus {
//   SENT = "SENT",
//   ACCEPTED = "ACCEPTED",
//   DECLINED = "DECLINED",
//   CANCELED = "CANCELED",
//   PAID = "PAID",
//   PENDING = "PENDING",
//   COMPLETED = "COMPLETED",
//   ITEM_GIVEN = "ITEM_GIVEN",
//   ITEM_NOT_GIVEN = "ITEM_NOT_GIVEN",
//   ITEM_RECEIVED = "ITEM_RECEIVED",
//   ITEM_NOT_RECEIVED = "ITEM_NOT_RECEIVED",
//   ITEM_IN_PROGRESS = "ITEM_IN_PROGRESS",
//   ITEM_RETURNED = "ITEM_RETURNED",
//   ITEM_NOT_RETURNED = "ITEM_NOT_RETURNED",
//   ITEM_ACCEPTED = "ITEM_ACCEPTED",
//   ITEM_DECLINED = "ITEM_DECLINED",
// }

// *** Rental Request Props ***
export type RentalRequestProps = {
  requestStatus: RequestStatus;
  id: string;
  item?: {
    title: string;
    price: number;
    picture: { url: string }[];
  };
  conversationId: string | null;
  renterId: string;
  ownerId: string;
  rentalDetails: RentalDetailsProps;
  rentalDates: RentalDatesProps;
};

type ItemCardProps = {
  id: string;
  title: string;
  price: number;
  picture?: { url: string }[];
};

export type RentalProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  conversationId: string;
  rentalNumber: string;
  requestStatus: RequestStatus;
  rentalStatus: RentalStatus;

  itemId: string;
  renterId: string;
  ownerId: string;

  renterMatchStatus: UserMatchStatus;
  ownerMatchStatus: UserMatchStatus;

  item: ItemCardProps;
  renter: UserCardProps;
  owner: UserCardProps;

  rentalDates: RentalDatesProps;
  rentalDetails: RentalDetailsProps;
  requestState: RequestStateProps;
  rentalState: RentalStatePops;

  reviews: ReviewProps[] | null;
  rewards: RewardProps[] | null;
  notifications: Notification[] | null;
  transaction: TransactionProps[] | null;
};

export type RentalDatesProps = {
  startDate: Date;
  endDate: Date;
  dateItemGiven: Date | null;
  dateItemReturned: Date | null;
};
export type RentalDetailsProps = {
  pricePerDay: number;
  totalDays: number;
  serviceFeePercent: number;
  serviceFee: number;
  discountAmount: number | null;
  discountPercent: number | null;
  totalPrice: number;
  totalPaid: number;
};

export type RequestStateProps = {
  isPending: boolean;
  isAccepted: boolean;
  isCanceled: boolean;
  isDeclined: boolean;
  isActionRequired: boolean;
  isPaid: boolean;
  isDiscounted: boolean;
};

export type RentalStatePops = {
  isItemGiven: boolean;
  isItemReceived: boolean;
  isItemInProgress: boolean;
  isItemReturned: boolean;

  isItemAccepted: boolean;
  isItemDeclined: boolean;

  isActionRequired: boolean;

  isCompleted: boolean;
  isDisputed: boolean;
  isResolved: boolean;
  isRefunded: boolean;
};
