import Floor from "../models/floor.model";
import { AppError } from "../utils";
import { IFloor } from "../interfaces";
import { APIFeatures } from "../utils/apiFeatures";
import { CheckRole } from "../utils";
import { FloorStatus, FloorType } from "../enums";


export const createFloorService = async (
  data: IFloor,
  adminRole: string
): Promise<IFloor> => {
  CheckRole(adminRole);
  if (typeof data.floor_name !== "string") {
    throw new AppError("The floor name must be a string", 400);
  }
  if (!Object.values(FloorType).includes(data.floor_type)) {
    throw new AppError(`the floor type (${data.floor_type}) invalid type`, 400);
  }
  if(data.floor_status && !Object.values(FloorStatus).includes(data.floor_status)) {
    throw new AppError(`the floor status (${data.floor_status}) invalid status`, 400);
  }  

  data.floor_name = data.floor_name.toUpperCase();

  const exists = await Floor.findOne({ floor_name: data.floor_name });
  if (exists) {
    throw new AppError("The floor name already exists", 400);
  }

  return await Floor.create(data);
};

export const getFloorsService = async (query: any): Promise<{ results: number; floors: IFloor[] }> => {
  const features = new APIFeatures(Floor.find(), query)
    .filter()
    .search("floor_name")
    .sort()
    .paginate();

  const floors = (await features.query) as IFloor[]; 

  return {
    results: floors.length,
    floors,
  };
};


export const getFloorByIdService = async (
  id: string
): Promise<IFloor | null> => {
  const floor = await Floor.findById(id);
  if (!floor) throw new AppError("Floor not found", 404);
  return floor;
};


export const updateFloorService = async (
  id: string,
  adminRole: string,
  data: Partial<IFloor>
): Promise<IFloor | null> => {
  CheckRole(adminRole);
  if (data.floor_name) {
    if (typeof data.floor_name !== "string") {
      throw new AppError("The floor name must be a string", 400);
    }
    data.floor_name = data.floor_name.toUpperCase();
  }

  const updated = await Floor.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw new AppError("Floor not found", 404);

  return updated;
};


export const deleteFloorService = async (
  id: string,
  adminRole: string
) => {
  CheckRole(adminRole);
  const floor = await Floor.findById(id);
  if (!floor) {
    throw new AppError("The floor not found", 404);
  }

  return await Floor.findByIdAndDelete(id);
};
