import express from "express";
import {
  getNotifications,
  getUsers,
  loginUser,
  registerUser,
  removeNotification,
  setNotification,
  handleOnlineStatu,
} from "../controller/auth";
import { protect } from "../middlewares/authMiddleware";
import { uploadMulter } from "../middlewares/multer";

const router = express.Router();

router
  .route("/")
  .post(uploadMulter.single("profilePhoto"), registerUser)
  .get(getUsers);
router.route("/login").post(uploadMulter.any(), loginUser);
router.route("/online-statu").post(uploadMulter.any(), handleOnlineStatu);
router.route("/user/:userId").get(getNotifications);
router
  .route("/notification")
  .post([uploadMulter.any(), protect], setNotification);
router
  .route("/remove-notification")
  .post([uploadMulter.any(), protect], removeNotification);

export default router;
