import { Document, ObjectId } from "mongoose";

export interface IShift extends Document {
  agentId: ObjectId;
  homeId: ObjectId;
  isAccepted: boolean;
  isCompleted: boolean;
  shiftType: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
