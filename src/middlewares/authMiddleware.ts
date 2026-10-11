import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { catchAsync, AppError } from "../utils";
import { DecodedToken } from "../interfaces";


export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new AppError("You are not logged in!", 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as DecodedToken;

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError("User not exist!", 401);
  }

  (req as any).user = user;

  next();
});
