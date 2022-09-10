import { NavigateFunction } from "react-router-dom";

export interface NavigateProps {
  formData: FormData;
  navigate: NavigateFunction;
}

export type StatusTypes = "idle" | "pending" | "succeeded" | "failed";

export interface DeletedInfoProps {
  _id: string;
  user: string;
  isVisible: boolean;
  isVisibleLatestMessage: boolean;
  time: Date;
}

export interface LatestMessageProps {
  user: string;
  message?: {
    content: string;
    sender: string;
  };
}

export interface Notification {
  message: Message;
  chat: string;
}

export interface ProfilePhoto {
  url: string;
  public_id: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  isOnline: boolean;
  profilePhoto: ProfilePhoto;
  token: string;
  notifications: Notification[];
}

export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  groupAdmin: User;
  latestMessage: LatestMessageProps[];
  deletedInfo: DeletedInfoProps[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  sender: {
    _id: string;
    fullName: string;
    profilePhoto: ProfilePhoto;
  };
  content: string;
  chat: Chat;
  readBy: string[];
  users: string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
}
