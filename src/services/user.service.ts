import validator from "validator";
import mongoose from "mongoose";
import { User } from "../models";
import { AppError } from "../utils";
import { IGetAllUsersResponse, IUser, IUserResponse } from "../interfaces";

///==> HELPER

const validateID = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid user ID", 400);
  }
};

///==> Service

export const getAllUsersService = async (): Promise<IGetAllUsersResponse> => {
  const users = await User.find()
    .select("-password")
    .lean<IUserResponse[]>();

  return {users};
};

export const getUserByIdService = async (id: string): Promise<IUserResponse> => {
  validateID(id);
  const user = await User.findById(id)
    .select("-password")
    .lean<IUserResponse>();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};


export const updateUserService = async (
  id: string,
  data: Partial<IUser>
) => {
  validateID(id);

  if (data.email && !validator.isEmail(data.email)) {
    throw new AppError("Invalid email format", 400);
  }

  const allowedFields = ["username", "email", "role", "type"];
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  );

  const updatedUser = await User.findByIdAndUpdate(id, filteredData, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  return { user: updatedUser };
};


export const deleteUserService = async (id: string) => {
  validateID(id);
  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    throw new AppError("User not found", 404);
  }
};
