import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import UserAuth from "../models/userModel";

interface UserPayload {
  id: Types.ObjectId;
}

export const protect = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

      req.currentUser = await UserAuth.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});
