import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserAuth from "../models/userModel";
import expressAsyncHandler from "express-async-handler";
import { Types } from "mongoose";
import cloudinary from "../utils/cloudinary";
import Message from "../models/messageModel";

const generateToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "30d" });
};

export const registerUser = expressAsyncHandler(async (req, res) => {
  const { fullName, password, email } = req.body;

  if (!fullName || !password || !email) {
    res.status(400).send("please add all fields");
    return;
  }

  const userExist = await UserAuth.findOne({ email });

  if (userExist) {
    res.status(400).send("user already exist");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let result;

  if (req.file) {
    result = await cloudinary.uploader.upload(req.file?.path);
  }

  const user = await UserAuth.create({
    fullName,
    email,
    password: hashedPassword,
    isOnline: true,
    profilePhoto: {
      url: result
        ? result.secure_url
        : "https://res.cloudinary.com/da30n9tw5/image/upload/v1659043847/cld-sample-2.jpg",
      public_id: result ? result.public_id : "default",
    },
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePhoto: user.profilePhoto,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send("invalid user");
  }
});

export const loginUser = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserAuth.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const updatedUser = await UserAuth.findOneAndUpdate(
      { email },
      { $set: { isOnline: true } },
      { new: true }
    );

    if (!updatedUser) {
      res.status(400).json("invalid user");
      return;
    }

    if (updatedUser) {
      res.status(201).json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        profilePhoto: updatedUser.profilePhoto,
        token: generateToken(updatedUser._id),
        isOnline: updatedUser.isOnline,
      });
    }
  } else {
    res.status(400).send("invalid user");
  }
});

export const handleOnlineStatu = expressAsyncHandler(async (req, res) => {
  const { email, statu } = req.body;

  const user = await UserAuth.findOneAndUpdate(
    { email },
    { $set: { isOnline: statu === "online" ? true : false } },
    { new: true }
  );

  res.status(200).send(user);
});

export const getUsers = expressAsyncHandler(async (req, res) => {
  const { keyword } = req.query;

  let handleSearch = keyword
    ? {
        $or: [
          { fullName: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      }
    : {};

  const users = await UserAuth.find(handleSearch, "-password");

  res.status(200).json(users);
});

export const getNotifications = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await UserAuth.findOne({ _id: userId });

  await user?.populate({
    path: "notifications",
    populate: {
      path: "message",
      model: "Message",
      populate: [
        {
          path: "sender",
          model: "UserAuth",
          select: "fullName profilePhoto",
        },
        {
          path: "chat",
          model: "Chat",
          populate: [
            {
              path: "users",
              model: "UserAuth",
              select: "fullName profilePhoto",
            },
          ],
        },
      ],
    },
  });

  if (!user) {
    res.status(400).send("no user");
    return;
  }

  res.status(200).json(user?.notifications);
});

export const setNotification = expressAsyncHandler(async (req, res) => {
  const { users, messageId, chatId } = req.body;

  if (!messageId || !chatId || !users) {
    res.status(400).json("please add all field");
  }

  const notification = { message: messageId, chat: chatId };

  const updatedUsers = await UserAuth.updateMany(
    { _id: { $in: users } },
    { $push: { notifications: notification } },
    { new: true }
  );

  if (!updatedUsers) {
    res.status(400).send("no user");
    return;
  }

  console.log(updatedUsers);

  const message = await Message.findOne({ _id: messageId });

  if (!message) {
    res.status(400).json("no message by this id");
    return;
  }

  if (message) {
    await message.populate("sender", "fullName profilePhoto");
    await message.populate({
      path: "chat",
      populate: {
        path: "users",
        model: "UserAuth",
      },
    });

    res.status(200).json({ message, chatId });
    return;
  }
});

export const removeNotification = expressAsyncHandler(async (req, res) => {
  const { chatId } = req.body;

  const user = await UserAuth.findOneAndUpdate(
    { _id: req.currentUser._id },
    {
      $pull: { notifications: { chat: { $eq: chatId } } },
    },
    { new: true }
  );

  res.status(200).json(chatId);
});
