import {
  DeletedInfoProps,
  LatestMessageProps,
  Message,
  Notification,
  User,
} from "../features/types";

interface GetUserProps {
  loggedUser: User;
  users: User[];
}

export const getSender = ({ loggedUser, users }: GetUserProps) => {
  const sender = users.filter((item) => item._id !== loggedUser._id)[0]
    .fullName;

  return sender;
};

export const getGuest = ({ loggedUser, users }: GetUserProps) => {
  const guestUser = users.filter((item) => item._id !== loggedUser._id)[0];

  return guestUser;
};

export interface isLastMessageProps {
  messages: Message[];
  i: number;
  userId: string;
}

export const isLastMessage = ({ messages, i, userId }: isLastMessageProps) => {
  const lastMessage =
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id;

  return lastMessage;
};

export interface IsSameSenderProps {
  messages: Message[];
  message: Message;
  i: number;
  userId: string;
}

export const isSameSender = ({
  i,
  message,
  messages,
  userId,
}: IsSameSenderProps) => {
  const sameSender =
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== message.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId;

  return sameSender;
};

interface CountSameMessageProps {
  notifications: Notification[];
  sender: string;
}

export const countSameMessage = ({
  notifications,
  sender,
}: CountSameMessageProps) => {
  const count = notifications.filter(
    (item) => item.message.sender._id === sender
  ).length;

  return count;
};

export const isInGroup = (users: User[], currentUser: User) => {
  return users.find((item) => item._id === currentUser._id);
};

export const handleLatestMessage = (
  latestMessage: LatestMessageProps[],
  user: User
) => {
  const currentLatestMessage = latestMessage.find(
    (item) => item.user === user._id
  );

  return currentLatestMessage;
};

export const handleDeletedChat = (
  deletedInfo: DeletedInfoProps[],
  currentUser: User
) => {
  return deletedInfo.find((item) => item.user === currentUser._id);
};
