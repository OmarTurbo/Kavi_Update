import { AppError } from "../utils";
import { IFloorPopulated, IUnit, IUnitResponse } from "../interfaces";
import { Unit, Floor } from "../models";
import { APIFeatures } from "../utils/apiFeatures";
import { CheckRole } from "../utils";

export const createUnitService = async (data: IUnit): Promise<IUnit> => {
  const existingUnit = await Unit.findOne({
    unit_segment: data.unit_segment
  });

  if (existingUnit) {
    throw new AppError("Unit already exists", 400);
  }
  const floorExists = await Floor.findById(data.floor);

  if (!floorExists) {
    throw new AppError("Floor not found", 404);
  }
  const unit = await Unit.create(data);

  return unit;
};


export const getUnitsService = async (query: Record<string, any>) => {
  const features = new APIFeatures(
    Unit.find().populate("floor", "floor_name floor_type floor_status"),
    query
  )
    .filter()
    .search("unit_segment")
    .sort()
    .paginate();

  const units = await features.query;

  const formattedUnits = units.map((u: any) => ({
    floor_name: u.floor?.floor_name,
    floor_type: u.floor?.floor_type,
    floor_status: u.floor?.floor_status,
    _id: u._id,
    unit_status: u.unit_status,
    mtr_price: u.mtr_price,
    outdoor_terrace: u.outdoor_terrace,
    total_area: u.total_area,
    GSA_area: u.GSA_area,
    unit_segment: u.unit_segment,
    type_segment: u.type_segment,
    final_price: u.final_price,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  }));

  return {
    results: formattedUnits.length,
    units: formattedUnits,
  };
};

export const getUnitByIdService = async (
  id: string
): Promise<IUnitResponse | null> => {
  const unitExist = await Unit.findById(id)
    .populate<{ floor: IFloorPopulated }>(
      "floor",
      "floor_name floor_type floor_status"
    );

  if (!unitExist) throw new AppError("Unit not found", 404);

  const unit: IUnitResponse = {
    floor_name: unitExist.floor?.floor_name,
    floor_type: unitExist.floor?.floor_type,
    floor_status: unitExist.floor?.floor_status,
    _id: unitExist._id,
    unit_status: unitExist.unit_status,
    mtr_price: unitExist.mtr_price,
    outdoor_terrace: unitExist.outdoor_terrace,
    total_area: unitExist.total_area,
    GSA_area: unitExist.GSA_area, 
    unit_segment: unitExist.unit_segment,
    type_segment: unitExist.type_segment,
    final_price: unitExist.final_price,
    createdAt: (unitExist as IUnitResponse)?.createdAt,
    updatedAt: (unitExist as IUnitResponse)?.updatedAt,
  };

  return unit;
};
export const updateUnitService = async (
  id: string,
  data: Partial<IUnit>,
  userRole: string
): Promise<IUnit> => {

  if (!Object.keys(data).length) {
    throw new AppError("No data provided for update", 400);
  }

  const ADMIN_FIELDS = ["mtr_price", "final_price", "type_segment", "unit_status", "outdoor_terrace", "total_area", "GSA_area"];
  const USER_FIELDS = ["unit_status"];

  const allowedFields =
    userRole === "admin" ? ADMIN_FIELDS : USER_FIELDS;

  const invalidFields = Object.keys(data).filter(
    (key) => !allowedFields.includes(key)
  );

  if (invalidFields.length) {
    throw new AppError(
      `You cannot update the following fields: ${invalidFields.join(", ")}`,
      403
    );
  }

  if (
    userRole !== "admin" &&
    ("mtr_price" in data || "final_price" in data)
  ) {
    throw new AppError("You do not have permission to update prices", 403);
  }

  const updatedUnit = await Unit.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!updatedUnit) {
    throw new AppError("Unit not found", 404);
  }
  
  return updatedUnit;
};

export const deleteUnitService = async(id: string, adminRole: string) => {
  CheckRole(adminRole);
  const unit = await Unit.findByIdAndDelete(id);
  if(!unit) throw new AppError("Unit not Found!", 404);
  return unit;
}