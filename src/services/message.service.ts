import { Message } from "../models";
import AppError from "../utils/AppError";
import { IMessage } from "../interfaces";
import { APIFeatures } from "../utils/apiFeatures";
import mongoose from "mongoose";

export const createMessageService = async (
  data: Partial<IMessage>
): Promise<IMessage> => {

  if (
    !data.firstName ||
    !data.lastName
  ) {
    throw new AppError("First and last name are required", 400);
  }
  
  if (
    typeof data.firstName !== 'string' ||
    typeof data.lastName !== 'string' ||
    typeof data.message !== 'string' ||
    typeof data.nationality !== 'string'
  ) {
    throw new AppError("All fields must be strings", 400);
  }  
  const phoneRegex = /^(?:(?:\+20|0020|0)?1[0125][0-9]{8}|(?:\+966|00966|0)?5[0-9]{8}|(?:\+971|00971|0)?5[0-9]{7,8})$/;

  if (!phoneRegex.test(data.phone as string)) {
    throw new AppError("Invalid phone number format", 400);
  }
  const message = await Message.create(data);
  return message as IMessage;
};


export const replyToMessageService = async (
  id: string,
  status: string
): Promise<IMessage> => {
  const message = await Message.findById(id);

  if (!message) {
    throw new AppError("Message not found", 404);
  }

  message.status = status as "replied" | "pending" ;
  // message.status = "replied";
  await message.save();

  return message as IMessage;
};

export const getAllMessagesService = async (
  query: Record<string, any>
): Promise<{ results: number; messages: IMessage[] }> => {

  const features = new APIFeatures(Message.find(), query)
    .filter()
    .sort()
    .paginate();

  const messages = (await features.query) as IMessage[];

  return {
    results: messages.length,
    messages,
  };
};

export const getAllMessagesServices = async() => {
  const messages = await Message.find();
  return messages;
}


export const getMessageByIdService = async (
  id: string
): Promise<IMessage> => {
  const message = await Message.findById(id);

  if (!message) {
    throw new AppError("Message not found", 404);
  }

  return message as IMessage;
};

export const deleteMessage = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid message ID", 400);
  }

  const message = await Message.findByIdAndDelete(id);

  if (!message) {
    throw new AppError("Message not found", 404);
  }

  return;
};