import expressAsyncHandler from "express-async-handler";
import Chat, { ChatSchemaProps, DeletedInfoProps } from "../models/chatModel";
import Message from "../models/messageModel";
import UserAuth, { UserSchemaProps } from "../models/userModel";
import mongoose from "mongoose";

export const sendMessage = expressAsyncHandler(async (req, res) => {
  const { chatId, content, users } = req.body;
  const user = await UserAuth.findById(req.currentUser._id);

  if (!chatId || !content) {
    res.status(400).send("please add all field");
    return;
  }

  await Chat.findOneAndUpdate(
    { _id: chatId },
    {
      $set: {
        "deletedInfo.$[].isVisible": true,
        "deletedInfo.$[].isVisibleLatestMessage": true,
        "latestMessage.$[i].message.content": content,
        "latestMessage.$[i].message.sender": (user as UserSchemaProps)
          ?.fullName,
      },
    },
    { arrayFilters: [{ "i.user": { $in: users } }], multi: true, new: true }
  );

  const newMessage = {
    sender: req.currentUser._id,
    content,
    chat: chatId,
    users,
  };

  const message = await Message.create(newMessage);

  await message.populate("sender", "fullName profilePhoto");
  await message.populate("chat");

  const extendedMessage = await UserAuth.populate(message, {
    path: "chat.users",
    select: "fullName profilePhoto email isOnline",
  });

  res.status(200).json(extendedMessage);
});

export const getMessages = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.params;

  const chat = await Chat.findById(chatId);

  const deletedInfo = (chat as ChatSchemaProps).deletedInfo.find(
    (item) => item.user.toString() === userId
  );

  const messages = await Message.find({
    $and: [
      {
        chat: chatId,
        createdAt: { $gte: deletedInfo?.time },
        users: { $in: userId },
      },
    ],
  })
    .populate("sender", "fullName profilePhoto email")
    .populate("chat");

  if (!messages) {
    res.status(400).send("no messages");
    return;
  }

  res.status(200).json(messages);
});
