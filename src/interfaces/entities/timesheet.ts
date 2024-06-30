import { Document, ObjectId } from "mongoose";
import { IShift } from "./shift";

export interface ITimesheet extends Document {
  shiftId: IShift;
  carerId: ObjectId;
  homeId: ObjectId;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}
