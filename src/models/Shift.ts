import { Schema, model, Types } from "mongoose";
import type { IShift } from "src/interfaces/entities/shift";

const shiftSchema = new Schema<IShift>({
  name: {
    type: String,
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
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  homeId: {
    type: Types.ObjectId,
    required: true,
  },
  assignedAgentId: {
    type: Types.ObjectId,
    required: true,
  },
});

const Shift = model<IShift>("Shift", shiftSchema);

export default Shift;
