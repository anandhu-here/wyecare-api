import type { Document, ObjectId } from "mongoose";

export interface IShift extends Document {
  name: string;
  completed: boolean;
  createdAt: Date;
  homeId: ObjectId;
  assignedAgentId: ObjectId;
  startTime: Date;
  endTime: Date;
}
