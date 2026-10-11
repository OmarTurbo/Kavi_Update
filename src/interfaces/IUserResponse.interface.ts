import { Types } from "mongoose";

export interface IUserResponse {
  _id: Types.ObjectId;
  username: string;
  email: string;
  role: "admin" | "user";
  type: "male" | "female";
};