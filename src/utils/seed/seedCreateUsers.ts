import UserAuth from "../../models/userModel";
import mongoose from "mongoose";
import {
  fullName,
  email,
  testOneFullName,
  testOneEmail,
  testTwoFullName,
  testTwoEmail,
  testThereeFullName,
  testThereeEmail,
  testDeleteFullName,
  testDeleteEmail,
  password,
} from "./veriables";
import bcrypt from "bcryptjs";
import { dbConnetion } from "./dbConnetion";

dbConnetion();

// create user to test groupfeatures, notifications, sendmessage
const seedCreateUsers = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("1907", salt);

  await UserAuth.create({
    fullName,
    email,
    password: hashedPassword,
    profilePhoto: {
      url: "https://res.cloudinary.com/da30n9tw5/image/upload/v1659043847/cld-sample-2.jpg",
      public_id: "default",
    },
  });

  await UserAuth.create({
    fullName: testOneFullName,
    email: testOneEmail,
    password: hashedPassword,
    profilePhoto: {
      url: "https://res.cloudinary.com/da30n9tw5/image/upload/v1659043847/cld-sample-2.jpg",
      public_id: "default",
    },
  });
  await UserAuth.create({
    fullName: testTwoFullName,
    email: testTwoEmail,
    password: hashedPassword,
    profilePhoto: {
      url: "https://res.cloudinary.com/da30n9tw5/image/upload/v1659043847/cld-sample-2.jpg",
      public_id: "default",
    },
  });
  await UserAuth.create({
    fullName: testThereeFullName,
    email: testThereeEmail,
    password: hashedPassword,
    profilePhoto: {
      url: "https://res.cloudinary.com/da30n9tw5/image/upload/v1659043847/cld-sample-2.jpg",
      public_id: "default",
    },
  });
  await UserAuth.create({
    fullName: testDeleteFullName,
    email: testDeleteEmail,
    password: hashedPassword,
    profilePhoto: {
      url: "https://res.cloudinary.com/da30n9tw5/image/upload/v1659043847/cld-sample-2.jpg",
      public_id: "default",
    },
  });
};

seedCreateUsers().then(() => {
  mongoose.connection.close();
  console.log("seedCreateUsers");
  console.log("disconnected mongoDB");
});
