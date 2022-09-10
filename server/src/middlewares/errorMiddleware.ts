import expressAsyncHandler from "express-async-handler";

const notFound = expressAsyncHandler(async (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

/* const errorHandler =expressAsyncHandler(async (req,res, next) => {

}) */
