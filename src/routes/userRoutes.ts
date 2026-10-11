import { Router } from "express";
import { Role } from "../enums";
import { getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
 } from "../controllers/user.controller";
 import { protect, restrictTo } from "../middlewares";

 const router = Router();

 router.use(protect);

 router.get("/", getAllUsers);
 router.get("/:id", getUserById);
 router.patch("/:id", restrictTo(Role.ADMIN_ROLE), updateUser);
 router.delete("/:id", restrictTo(Role.ADMIN_ROLE), deleteUser);

export default router; 