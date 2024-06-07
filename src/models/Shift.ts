import { model, Schema, Types } from "mongoose";
import type { IShift } from "src/interfaces/entities/shift";

const ShiftSchema: Schema = new Schema<IShift>(
  {
    agentId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    homeId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    shiftType: {
      type: Types.ObjectId,
      ref: "ShiftType", // Make sure this matches the model name exactly
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ShiftModel = model<IShift>("Shift", ShiftSchema);

export default ShiftModel;
