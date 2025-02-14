import { ConversationProps, ItemUserProps } from "./ConversationProps";
import { MessageProps } from "./MessageProps";
import { RentalProps } from "./RentalProps";
import { TransactionProps } from "./TransactionProps";
import { ProfileProps, UserCardProps, UserLocationProps } from "./UserProps";

export type Category = {
  id: string;
  name: string;
  parentId: string | null;
  image: string | null;
};
export type Picture = {
  id: string;
  url: string;
  itemId: string;
};

export type ItemProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  categoryId: string;
  title: string;
  picture: Picture[];
  price: number;
  description: string;
  locationDescription: string;
  lat: number;
  lng: number;

  isAvailable: boolean;
  isPaused: boolean;
  isDeleted?: boolean;

  dateUnavailable: Date[] | null;
  dateRenting: Date[] | null;
  dateRequested: Date[] | null;

  owner: UserLocationProps;
  category: Category;
  favoritedBy?: any[];
  conversations?: ConversationProps[];
  messages?: MessageProps[];
  rentals?: RentalProps[];
  transaction?: TransactionProps[];
};

export type ItemCardProps = {
  id: string;
  title: string;
  price: number;
  picture: Picture[];
  category: Category;
  owner: UserCardProps;
  isAvailable?: boolean;
  isPaused?: boolean;
};

export type ItemEditProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  categoryId: string;
  title: string;
  picture: Picture[];
  price: number;
  description: string;
  locationDescription: string;
  lat: number;
  lng: number;
  isAvailable: boolean;
  isPaused: boolean;
  isDeleted?: boolean;
  owner: {
    id: string;
    email: string;
    name: string;
    profile: ProfileProps;
  };
  category: {
    id: string;
    name: string;
    image: string | null;
    parentId: string | null;
    parent: {
      id: string;
      name: string;
      parentId: string | null;
      parent: {
        id: string;
        name: string;
      } | null;
    } | null;
  };
  favoritedBy?: any[];
  conversations?: ConversationProps[];
  messages?: MessageProps[];
  rentals?: RentalProps[];
  transaction?: TransactionProps[];
};

export type ItemRequestProps = {
  id: string;
  title: string;
  price: number;
  picture: Picture[];
  category: Category;
  owner: ItemUserProps;
  receiver?: ItemUserProps;
  dateUnavailable: Date[] | null;
  dateRenting: Date[] | null;
  dateRequested: Date[] | null;
};
