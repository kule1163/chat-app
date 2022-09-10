import multer from "multer";

const storage = multer.diskStorage({});

export const uploadMulter = multer({
  storage: storage,
});
