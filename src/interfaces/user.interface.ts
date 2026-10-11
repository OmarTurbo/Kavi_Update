import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  role: "admin" | "user";
  type: "male" | "female";
  password?: string;
  comparePassword(candidate: string): Promise<boolean>;
}
