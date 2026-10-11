import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import {
  createMessageService,
  replyToMessageService,
  getAllMessagesService,
  getMessageByIdService,
  deleteMessage,
  getAllMessagesServices,
} from "../services/message.service";

export const createMessage = catchAsync(async (req: Request, res: Response) => {
  const message = await createMessageService(req.body);

  res.status(201).json({
    status: "success",
    data: message,
  });
});

export const replyToMessage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const message = await replyToMessageService(id, status);

  res.status(200).json({
    status: "success",
    data: message,
  });
});

// export const getAllMessages = catchAsync(async (req: Request, res: Response) => {
//   const {results , messages} = await getAllMessagesService(req.query);

//   res.status(200).json({
//     status: "success",
//     results,
//     data: messages,
//   });
// });
export const getAllMessages = catchAsync(async (req: Request, res: Response) => {
  const messages = await getAllMessagesServices();

  res.status(200).json({
    status: "success",
    data: messages,
  });
});

export const getMessageById = catchAsync(async(req: Request, res: Response) => {
  const message = await getMessageByIdService(req.params.id);
  res.status(200).json({
    status: "success",
    message,
  });
});

export const deleteMessageById = catchAsync(async(req: Request, res: Response) => {
  console.log (req.params.id);
  await deleteMessage(req.params.id);
  res.status(200).json({
    status: "success", 
    message: "Message deleted successfully"
  }); 
}); 