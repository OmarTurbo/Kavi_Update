import User from "../models/user.model";
import { AppError } from "../utils";
import { IUser } from "../interfaces/user.interface";
import { signToken } from "../utils/signToken";

export const signUpService = async (data: IUser) => {
  const { username, email, role, type, password } = data;

  const newUser = await User.create({
    username,
    email,
    role,
    type,
    password,
  });

  return newUser;
};

export const loginService = async (username: string, password: string) => {

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    throw new AppError("Invalid username or password", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid username or password", 401);
  }
  const token = signToken(user._id.toString(), user.email, user.role);


  return { user, token };
};

