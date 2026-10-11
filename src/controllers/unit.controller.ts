import { Request, Response } from "express";
import { catchAsync } from "../utils";
import {
  createUnitService,
  getUnitsService,
  getUnitByIdService,
  updateUnitService,
  deleteUnitService,
} from "../services/unit.service";


export const createUnit = catchAsync(async(req: Request, res: Response) => {
  const unit = await createUnitService(req.body);
  res.status(201).json({
    status: "success",
    unit
  });
});


export const getUnits = catchAsync(async (req: Request, res: Response) => {
  const { results, units } = await getUnitsService(req.query);

  res.status(200).json({
    status: "success",
    results,
    data: units,
  });
});

export const getUnitById = catchAsync(async(req: Request, res: Response) => {
  const unit = await getUnitByIdService(req.params.id);
  res.status(200).json({
    status: "success",
    unit
  });
});

export const updateUnitById = catchAsync(async(req: Request, res: Response) => {
  const userRole = (req as any).user.role;
  const unit = await updateUnitService(req.params.id, req.body, userRole);
  res.status(200).json({
    status: "success",
    unit,
  });
});

export const deleteUnitById = catchAsync(async(req: Request, res: Response) => {
  const adminRole = (req as any).user.role;
  const unit = await deleteUnitService(req.params.id, adminRole);
  res.status(200).json({
    status: "success",
    unit,
  }) 
})