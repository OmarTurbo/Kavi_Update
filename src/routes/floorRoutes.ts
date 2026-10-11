import { Router } from "express";
import {
  createFloor,
  getFloors,
  getFloorById,
  updateFloor,
  deleteFloor
} from "../controllers/floor.controller";
import { protect, restrictTo } from "../middlewares";
import { Role } from "../enums";

const router = Router();

router.get("/", getFloors);

router.get("/:id", getFloorById);

router.use(protect);
router.use(restrictTo(Role.ADMIN_ROLE, Role.USER_ROLE));

router.post("/", createFloor);


router.patch("/:id", updateFloor);

router.delete("/:id", deleteFloor);

export default router;
