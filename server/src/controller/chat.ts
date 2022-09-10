import expressAsyncHandler from "express-async-handler";
import Chat, {
  DeletedInfoProps,
  LatestMessageProps,
} from "../models/chatModel";
import Message from "../models/messageModel";
import UserAuth from "../models/userModel";

const handleDeletedInfo = (users: any[]) => {
  const deletedInfo: DeletedInfoProps[] = [];

  users.forEach((item) =>
    deletedInfo.push({
      user: item,
      isVisible: true,
      time: new Date(),
      isVisibleLatestMessage: true,
    })
  );

  return deletedInfo;
};

const handleLatestMessage = (users: any[]) => {
  const latestMessage: LatestMessageProps[] = [];

  users.forEach((item) => latestMessage.push({ user: item, message: null }));

  return latestMessage;
};

export const accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).send("user id param not sent with request");
  }

  const isChat = await Chat.findOneAndUpdate(
    {
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.currentUser._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    },
    { $set: { "deletedInfo.$[i].isVisible": true } },
    { arrayFilters: [{ "i.user": req.currentUser._id }], new: true }
  )
    .populate("users", "-password")
    .populate("latestMessage");

  const chat = await UserAuth.populate(isChat, {
    path: "latestMessage.sender",
    select: "fullName profilePhoto email",
  });

  if (chat) {
    res.status(200).json(chat);
  } else {
    const users = [req.currentUser._id, userId];

    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users,
      deletedInfo: handleDeletedInfo(users),
      latestMessage: handleLatestMessage(users),
    };

    try {
      const createdChat = await Chat.create(chatData);

      /* console.log("created chat", createdChat); */

      const newChat = await Chat.findById(createdChat._id)
        .populate("users", "-password")
        .populate("latestMessage");

      res.status(200).json(newChat);
    } catch (error) {
      console.log(error);

      res.status(400).send("not created new chat");
    }
  }
});

export const deleteChat = expressAsyncHandler(async (req, res) => {
  const { chatId } = req.body;

  const chat = await Chat.findOneAndUpdate(
    {
      $and: [
        { _id: chatId },
        {
          deletedInfo: {
            $elemMatch: { user: req.currentUser._id },
          },
        },
      ],
    },
    {
      $set: {
        "deletedInfo.$.time": new Date(),
        "deletedInfo.$.isVisible": false,
        "deletedInfo.$.isVisibleLatestMessage": false,
      },
    },
    { new: true }
  );

  if (!chat) {
    res.status(400).send("no chat by this id");
    return;
  }

  res.status(200).json(chat);
});

export const fetchChats = expressAsyncHandler(async (req, res) => {
  const chats = await Chat.find({
    deletedInfo: {
      $elemMatch: { user: req.currentUser._id, isVisible: true },
    },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage");

  const userChats = await UserAuth.populate(chats, {
    path: "latestMessage.sender",
    select: "fullName profilePhoto email",
  });

  if (!userChats || !chats) {
    res.status(400).send("chat not created");
    return;
  }

  res.status(200).json(userChats);
});

export const createGroupChat = expressAsyncHandler(async (req, res) => {
  const { chatName, users } = req.body;

  if (!users || !chatName) {
    res.status(400).json("please add all fields");
    return;
  }

  if (users.length < 2) {
    res.status(400).json("more than 1 users required to group chat");
    return;
  }

  users.push(req.currentUser._id);

  const groupChat = await Chat.create({
    users,
    isGroupChat: true,
    groupAdmin: req.currentUser._id,
    chatName,
    deletedInfo: handleDeletedInfo(users),
    latestMessage: handleLatestMessage(users),
  });

  const fullGroupChat = await Chat.findById(groupChat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!groupChat || !fullGroupChat) {
    res.status(400).send("group didnt creat");
    return;
  }

  res.status(200).json(fullGroupChat);
});

export const renameGroup = expressAsyncHandler(async (req, res) => {
  const { chatName, chatId } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(400).send("chat not found");
  }

  res.status(200).json(updatedChat);
});

export const addToChat = expressAsyncHandler(async (req, res) => {
  const { chatId, users } = req.body;

  const deletedInfo = handleDeletedInfo(users) as any;
  const latestMessage = handleLatestMessage(users) as any;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: users, deletedInfo, latestMessage },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(400).send("chat not found");
    return;
  }

  res.status(200).json(added);
});

export const removeFromChat = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: {
        users: userId,
        deletedInfo: {
          $elemMatch: {
            user: userId,
          },
        },
      },
      $push: {
        leaveInfo: {
          user: userId,
          time: new Date(),
        },
      },
    },

    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(400).send("chat not found");
    return;
  }

  res.status(200).json(removed);
});
