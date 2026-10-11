import { Request, Response } from "express";
import { catchAsync } from "../utils";
import {
  createFloorService,
  getFloorsService,
  updateFloorService,
  getFloorByIdService,
  deleteFloorService
} from "../services/floor.service";

export const createFloor = catchAsync(async (req: Request, res: Response) => {
  const adminRole = (req as any).user.role;
  const floor = await createFloorService(req.body, adminRole);
  res.status(201).json({ status: "success", floor });
});

export const getFloors = catchAsync(async (req: Request, res: Response) => {
  const { results, floors } = await getFloorsService(req.query);

  res.status(200).json({
    status: "success",
    results,
    data: floors,
  });
});


export const getFloorById = catchAsync(async (req: Request, res: Response) => {
  const floor = await getFloorByIdService(req.params.id);
  res.status(200).json({ status: "success", floor });
});

export const updateFloor = catchAsync(async (req: Request, res:Response) => {
  const adminRole = (req as any).user.role;
  const floor = await updateFloorService(req.params.id, adminRole,req.body);
  res.status(200).json({ status: "success", floor });
});

export const deleteFloor = catchAsync(async(req: Request, res: Response) => {
  const adminRole = (req as any).user.role;
  const floor = await deleteFloorService(req.params.id, adminRole);
  res.status(200).json({ status: "sucess", floor});
})