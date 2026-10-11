import { Router } from "express";
import {
  createUnit,
  getUnits,
  getUnitById,
  updateUnitById,
  deleteUnitById,
} from "../controllers/unit.controller";
import { protect, restrictTo } from "../middlewares";
import { Role } from "../enums";

const router = Router();

router.get("/", getUnits);

router.get("/:id", getUnitById);

router.use(protect);
router.post("/", restrictTo(Role.ADMIN_ROLE), createUnit);

router.use(restrictTo(Role.ADMIN_ROLE, Role.USER_ROLE));

router.patch("/:id", updateUnitById);

router.delete("/:id", deleteUnitById);

export default router;

