import { Document, ObjectId, type Types } from "mongoose";

export interface IShift extends Document {
  agentId: ObjectId;
  homeId: ObjectId;
  isAccepted: boolean;
  isRejected: boolean;
  date: string;
  isCompleted: boolean;
  shiftType: ObjectId;
  count: number;
  assignedUsers: Types.ObjectId[];
  privateKey?: string;
  signedCarers?: {
    [carerId: string]: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
