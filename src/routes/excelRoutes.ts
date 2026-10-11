import { Router } from "express";
import { importExcel, exportExcel } from "../controllers/excel.controller";
import { uploadExcel } from "../utils/multer";
import { protect, restrictTo } from "../middlewares";
import { Role } from "../enums";
 
const router = Router();

router.use(protect);
router.use(restrictTo(Role.ADMIN_ROLE));

router.post("/import", uploadExcel.single("file"), importExcel);
router.get("/export",  exportExcel);

export default router;
