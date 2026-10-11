import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils";

const handleCastErrorDB = (err: any) => {
  const message = `Invalid field ${err.path}.`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (err: any) => {
  if (!err.keyValue) return new AppError('Duplicate field value', 400) // add this
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field} '${value}' already exists. Please choose another one.`;
  return new AppError(message, 400);
};
const handleValidationError = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input: ${errors.join(", ")}`;
  return new AppError(message, 400);
};

const handleJwtError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJwtExpiredError = () =>
  new AppError("Your token has expired. Please log in again!", 401);

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err, message: err.message };

  if (err.name === "CastError") error = handleCastErrorDB(err);

  if (err.code === 11000) error = handleDuplicateFields(err);

  if (err.name === "ValidationError") error = handleValidationError(err);

  if (err.name === "JsonWebTokenError") error = handleJwtError();
  if (err.name === "TokenExpiredError") error = handleJwtExpiredError();

  return res.status(error.statusCode || 500).json({
    status: error.status || "error",
    message: error.message || "Something went wrong!",
  });
};

export default globalErrorHandler;
