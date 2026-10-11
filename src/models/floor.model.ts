import mongoose, { Schema } from "mongoose";
import { IFloor } from "../interfaces";
import { FloorType, FloorStatus } from "../enums";

const floorSchema = new Schema<IFloor>(
  {
    floor_name: {
      type: String,
      required: [true, "Floor name is required"],
      unique: true,
      trim: true,
    },
    floor_type: {
      type: String,
      enum: Object.values(FloorType),
      required: [true, "Floor type is required"],
    },
    floor_status: {
      type: String,
      enum: Object.values(FloorStatus),
      default: FloorStatus.AVAILABLE,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

floorSchema.virtual("units", {
  ref: "Unit",
  localField: "_id",
  foreignField: "floor",
});

export default mongoose.model<IFloor>("Floor", floorSchema);
