import { Request, Response, NextFunction } from "express";
import {AppError} from "../utils";

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user; 

    if (!user) {
      return next(new AppError("You are not logged in!", 401));
    }

    if (!roles.includes(user.role)) {
      return next(new AppError("You do not have permission to perform this action!", 403));
    }

    next();
  };
};
