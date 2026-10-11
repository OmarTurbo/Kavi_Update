import { Request, Response } from "express";
import fs from "fs";
import {AppError, catchAsync} from "../utils";
import { importExcelService, exportExcelService } from "../services/excel.service";

export const importExcel = catchAsync(async (req: Request, res: Response) => {
  
  if (!req.file) {
    throw new AppError("No file uploaded. Make sure your form-data key is 'file'", 400);
  }

  const filePath = req.file.path;

  const result = await importExcelService(filePath);

  res.status(200).json({
    status: "success",
    data: result,
  });
});


export const exportExcel = catchAsync(async (req: Request, res: Response) => {
  const filePath = await exportExcelService();

  res.download(filePath, (err) => {
    if (err) {
      console.error("Download error:", err);
      return res.status(500).json({ message: "Failed to download file" });
    }

    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting file:", unlinkErr);
      } else {
        console.log("Export file deleted successfully");
      }
    });
  });
});
