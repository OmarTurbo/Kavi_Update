import { Document } from "mongoose";

export interface IMessage extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  message: string;
  reply?: string;
  status: "pending" | "replied";
}