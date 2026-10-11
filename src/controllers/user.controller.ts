import { Request, Response } from "express";
import { catchAsync } from "../utils";
import { deleteUserService, 
  getAllUsersService, 
  getUserByIdService, 
  updateUserService } from "../services/user.service";


export const getAllUsers = catchAsync(async(req: Request, res: Response) => {
  const allUsers = await getAllUsersService();

  res.status(200).json({
    status: "success",
    result: allUsers.users.length,
    users: allUsers.users
  });
});

export const getUserById = catchAsync(async(req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await getUserByIdService(userId);

  res.status(200).json({
    status: "success",
    user
  });
});

export const updateUser = catchAsync(async(req: Request, res: Response) => {
  const userId = req.params.id;
  const data = req.body;
  const user = await updateUserService(userId, data);

  res.status(200).json({
    status: "success",
    user
  });
});

export const deleteUser = catchAsync(async(req: Request, res: Response) => {
  const userId = req.params.id;
  await deleteUserService(userId);

  res.status(200).json({
    status: "success",
    message: "User Deleted Successfully",
  });
});