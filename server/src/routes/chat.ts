import express from "express";
import {
  accessChat,
  addToChat,
  createGroupChat,
  deleteChat,
  fetchChats,
  removeFromChat,
  renameGroup,
} from "../controller/chat";
import { protect } from "../middlewares/authMiddleware";
import { uploadMulter } from "../middlewares/multer";

const router = express.Router();

router.route("/").post([protect, uploadMulter.any()], accessChat);
router.route("/fetch-chats").get(protect, fetchChats);
router.route("/group").post([protect, uploadMulter.any()], createGroupChat);
router.route("/rename").put([protect, uploadMulter.any()], renameGroup);
router.route("/add-user").put([protect, uploadMulter.any()], addToChat);
router.route("/remove-user").put([protect, uploadMulter.any()], removeFromChat);
router.route("/delete-chat").put([protect, uploadMulter.any()], deleteChat);

export default router;
