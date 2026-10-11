import mongoose, { Schema } from "mongoose";
import { IUnit } from "../interfaces";
import { UnitStatus, TypeSegment } from "../enums/unitEnums";

const UnitSchema = new Schema<IUnit>(
  {
    floor: {
      type: Schema.Types.ObjectId,
      ref: "Floor",
      required: true,
    },
    unit_status: {
      type: String,
      enum: Object.values(UnitStatus),
      default: UnitStatus.AVAILABLE,
    },

    mtr_price: {
      type: Number,
      required: true,
      default: 0,
    },
    outdoor_terrace: {
      type: Number,
      required: true,
      default: 0,
    },

    total_area: {
      type: Number,
      required: true,
    },
    GSA_area: {
      type: Number,
      required: true,
    },

    unit_segment: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    type_segment: {
      type: String,
      enum: Object.values(TypeSegment),
      required: true,
    },
    final_price: {
      type: Number,
      required: true,
    },
     progUnitKey: {
      type: Number,
      unique: true,
      index: true,
      required: false,
    },
  },
  { timestamps: true }
);

UnitSchema.pre("save", async function () {
  if (!this.isNew || this.progUnitKey) {
    return;
  }

  const lastUnit = await mongoose
    .model("Unit")
    .findOne({}, { progUnitKey: 1 })
    .sort({ progUnitKey: -1 });

  this.progUnitKey = lastUnit?.progUnitKey
    ? lastUnit.progUnitKey + 1
    : 1;
});

export default mongoose.model<IUnit>("Unit", UnitSchema);