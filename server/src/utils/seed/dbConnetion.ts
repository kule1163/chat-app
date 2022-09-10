import mongoose from "mongoose";

export const dbConnetion = () => {
  const CONNETION_URL =
    "mongodb+srv://kule1163:thv8pyyx4z@cluster0.zjlbe.mongodb.net/chatApp?retryWrites=true&w=majority";
  mongoose
    .connect(CONNETION_URL)
    .then(() => {
      console.log("connected by mongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
};
