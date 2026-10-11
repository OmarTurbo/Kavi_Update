import { FloorType, FloorStatus } from './../enums';
import { Document, Types } from "mongoose";

export interface IFloor extends Document {
  _id: Types.ObjectId;
  floor_name: string;
  floor_type: FloorType;
  floor_status: FloorStatus;
}
