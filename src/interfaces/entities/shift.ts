import { Document, ObjectId, type Types } from "mongoose";

export interface IShift extends Document {
  agentId: ObjectId;
  homeId: ObjectId;
  isAccepted: boolean;
  isRejected: boolean;
  isCompleted: boolean;
  shiftType: ObjectId;
  count: number;
  assignedUsers: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
