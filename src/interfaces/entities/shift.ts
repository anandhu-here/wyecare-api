import type { Document } from "mongoose";
import type { IShiftType } from "./shift-types";

export interface IShift extends Document {
  agentId: string;
  homeId: string;
  assignedUserId: string;
  shiftType: IShiftType;
  startTime: Date;
  endTime: Date;
  isCompleted: boolean;
  isAccepted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
