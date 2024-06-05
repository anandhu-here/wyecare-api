import { Schema, Types, model } from "mongoose";
import type { IUserShiftTypeModel } from "src/interfaces/entities/shift-types";

const ShiftTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

const UserShiftTypeSchema = new Schema<IUserShiftTypeModel>(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    shifttypes: [ShiftTypeSchema],
  },
  { timestamps: true }
);

const UserShiftType = model<IUserShiftTypeModel>(
  "UserShift",
  UserShiftTypeSchema
);

export default UserShiftType;
