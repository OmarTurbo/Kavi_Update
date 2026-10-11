import express from "express";
import {
  createMessage,
  getAllMessages,
  replyToMessage,
  getMessageById,
  deleteMessageById,
} from "../controllers/message.controller";
import { protect, restrictTo } from "../middlewares";
import { Role } from "../enums";

const router = express.Router();

router.post("/", createMessage);

router.use(protect)
router.get("/", restrictTo(Role.ADMIN_ROLE, Role.USER_ROLE), getAllMessages);
router.patch('/:id/reply', restrictTo(Role.ADMIN_ROLE, Role.USER_ROLE), replyToMessage);
router.get("/:id", restrictTo(Role.ADMIN_ROLE, Role.USER_ROLE), getMessageById)
router.delete("/:id", restrictTo(Role.ADMIN_ROLE, Role.USER_ROLE), deleteMessageById);

export default router;