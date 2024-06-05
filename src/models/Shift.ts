import { model, Schema } from "mongoose";
import type { IShift } from "src/interfaces/entities/shift";

export interface IShiftModel extends IShift {}

const ShiftSchema: Schema = new Schema(
  {
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    homeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shiftType: {
      type: Schema.Types.ObjectId,
      ref: "ShiftType",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ShiftModel = model<IShiftModel>("Shift", ShiftSchema);

export default ShiftModel;
