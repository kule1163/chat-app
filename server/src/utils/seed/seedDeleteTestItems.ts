import UserAuth from "../../models/userModel";
import {
  email,
  testOneEmail,
  testTwoEmail,
  testThereeEmail,
  testDeleteEmail,
} from "./veriables";
import Message from "../../models/messageModel";
import Chat from "../../models/chatModel";
import mongoose from "mongoose";
import { dbConnetion } from "./dbConnetion";

dbConnetion();

// delete all created Items groupfeatures, notifications, sendmessage
const seedDeleteTestItems = async () => {
  try {
    const admin = await UserAuth.findOne({ email });
    const testOne = await UserAuth.findOne({ email: testOneEmail });
    const testTwo = await UserAuth.findOne({ email: testTwoEmail });
    const testTheree = await UserAuth.findOne({ email: testThereeEmail });
    const testDelete = await UserAuth.findOne({ email: testDeleteEmail });

    await Chat.deleteMany({ users: { $elemMatch: { $eq: admin?._id } } });
    await Chat.deleteMany({ users: { $elemMatch: { $eq: testOne?._id } } });
    await Chat.deleteMany({ users: { $elemMatch: { $eq: testTwo?._id } } });
    await Chat.deleteMany({ users: { $elemMatch: { $eq: testTheree?._id } } });
    await Chat.deleteMany({ users: { $elemMatch: { $eq: testDelete?._id } } });

    await Message.deleteMany({ users: { $elemMatch: { $eq: admin?._id } } });
    await Message.deleteMany({ users: { $elemMatch: { $eq: testOne?._id } } });
    await Message.deleteMany({ users: { $elemMatch: { $eq: testTwo?._id } } });
    await Message.deleteMany({
      users: { $elemMatch: { $eq: testTheree?._id } },
    });
    await Message.deleteMany({
      users: { $elemMatch: { $eq: testDelete?._id } },
    });

    await UserAuth.findOneAndDelete({ email });
    await UserAuth.findOneAndDelete({ email: testOneEmail });
    await UserAuth.findOneAndDelete({ email: testTwoEmail });
    await UserAuth.findOneAndDelete({ email: testThereeEmail });
    await UserAuth.findOneAndDelete({ email: testDeleteEmail });
  } catch (error) {
    console.log(error);
  }
};

seedDeleteTestItems().then(() => {
  mongoose.connection.close();
  console.log("seedDeleteTestItems");
  console.log("disconnected mongodb");
});
