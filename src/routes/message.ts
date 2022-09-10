import express from "express";
import { getMessages, sendMessage } from "../controller/message";
import { protect } from "../middlewares/authMiddleware";
import { uploadMulter } from "../middlewares/multer";

const router = express.Router();

router.route("/").post([uploadMulter.any(), protect], sendMessage);
router.route("/:chatId/:userId").get(getMessages);

export default router;
