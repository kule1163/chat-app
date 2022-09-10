import UserAuth from "../../models/userModel";
import { email } from "./veriables";
import mongoose from "mongoose";
import { dbConnetion } from "./dbConnetion";

dbConnetion();

// delete auth item
const deleteAuthItem = async () => {
  await UserAuth.findOneAndDelete({ email });
};

deleteAuthItem().then(() => {
  mongoose.connection.close();
  console.log("deleteAuthItem");
  console.log("disconnected mongodb");
});
