import {
  Conversation,
  Favorite,
  Item,
  Notification,
  Review,
} from "@prisma/client";
import { MessageProps } from "./MessageProps";
import { RentalProps } from "./RentalProps";
import { RewardProps } from "./RewardProps";
import { TransactionProps } from "./TransactionProps";
import { ConversationProps } from "./ConversationProps";

export type UserCardProps = {
  id: string;
  name: string;
  email?: string;
  profile: {
    image: string | null;
    mobilePhone?: string | null;
    averageRating: number;
    totalReviews: number;
  };
};
export type UserProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  lastSeen: Date | null;
  isOnline?: boolean;
  profile: ProfileProps;
  location: LocationProps | null;
  wallet: WalletProps;
  settings: SettingsProps;
  verification: VerificationProps;
  metrics: MetricsProps;

  items?: Item[] | null;
  reviews?: Review[] | null;
  reviewsAsReviewer?: Review[] | null;
  favorites?: Favorite[] | null;

  conversationIds: string[] | null;
  conversations?: ConversationProps[] | null;
  requestedConversation?: ConversationProps[] | null;
  receivedConversation?: ConversationProps[] | null;

  sentMessages?: MessageProps[] | null;
  receivedMessages?: MessageProps[] | null;

  rentalAsOwner?: RentalProps[] | null;
  rentalAsRenter?: RentalProps[] | null;

  notificationsSent: Notification[];
  notificationsReceived: Notification[];

  renterTransactions?: TransactionProps[] | null;
  ownerTransactions?: TransactionProps[] | null;

  rewards?: RewardProps[] | null;
};

export type ProfileProps = {
  firstName: string | null;
  lastName: string | null;
  image: string | null;

  averageRating: number;
  totalReviews: number;

  mobilePhone: string | null;
  bio: string | null;
};

export type UserProfileProps = {
  id: string;
  createdAt: Date;
  name: string;
  email: string;
  profile: ProfileProps;
  verification: VerificationProps;
  location: LocationProps | null;
  rentalAsOwner?: RentalProps[] | null;
  rentalAsRenter?: RentalProps[] | null;
  metrics: MetricsProps | null;
};

export type LocationProps = {
  city: string | null;
  country: string | null;
  address: string | null;
  addressLat: number | null;
  addressLng: number | null;
  postalCode: string | null;
  postalCodeLat: number | null;
  postalCodeLng: number | null;
};

export type SettingsProps = {
  emailNotification: boolean;
  mobileNotification: boolean;
  holidayMode: boolean;
};

export type VerificationProps = {
  emailVerified: boolean;
  mobileVerified: boolean;
  identityVerified: boolean;
  certified: boolean;
  emailVerificationCode: string | null;
  mobileVerificationCode?: string | null;
  expiresAt: Date | null;
};

export type WalletProps = {
  balance: number;
  pendingBalance: number;
  totalRewards: number;
  stripeAccID: string | null;
  stripeAccStatus: string | null;
  currency: string;
  // stripeToken?: string;
};

export type MetricsProps = {
  numberOfConnections: number;
  responseTime: number;
  responseRate: number;
};

export type UserWalletProps = {
  id: string;
  name: string;
  email: string;
  lastSeen: Date | null;
  profile: {
    image: string | null;
  };
  wallet: WalletProps;
  rentalAsOwner?: { totalPrice: number }[];
  payoutMethods?: any[];
  ownerTransactions?: TransactionProps[];
  renterTransactions?: TransactionProps[];
};
export type UserLocationProps = {
  id: string;
  name: string;
  email?: string;
  profile: {
    image: string | null;
  };
  location: LocationProps | null;
  wallet?: {
    stripeAccStatus: string | null;
  };
};
export type UserConversationProps = UserCardProps & {
  conversationIds: string[];
  requestedConversation: Conversation[];
  receivedConversation: Conversation[];
};
