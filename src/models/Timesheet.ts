import { Schema, model, Types } from "mongoose";
import { ITimesheet } from "../interfaces/entities/timesheet";
import { ShiftSchema } from "./Shift";

const TimesheetSchema = new Schema<ITimesheet>(
  {
    shiftId: {
      type: Types.ObjectId,
      ref: "Shift",
      required: true,
    },
    carerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    homeId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

TimesheetSchema.virtual("shift", {
  ref: "Shift",
  localField: "shiftId",
  foreignField: "_id",
  justOne: true,
});

const TimesheetModel = model<ITimesheet>("Timesheet", TimesheetSchema);

export default TimesheetModel;
