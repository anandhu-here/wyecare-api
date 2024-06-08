import ShiftModel from "src/models/Shift";
import { Types } from "mongoose";
import type { IShift } from "src/interfaces/entities/shift";

class ShiftService {
  public getPublishedShifts = async (
    userId: string | Types.ObjectId
  ): Promise<IShift[]> => {
    const shifts = await ShiftModel.find().populate("shiftType");
    return shifts;
  };

  public getShiftById = async (
    shiftId: string | Types.ObjectId
  ): Promise<IShift | null> => {
    try {
      const shift = await ShiftModel.findById(shiftId).exec();
      console.log("Shift without populate:", shift);

      const populatedShift = await ShiftModel.findById(shiftId)
        .populate("shiftType")
        .exec();

      console.log("Shift with populate:", populatedShift);

      if (!populatedShift) {
        console.log("Shift not found");
        return null;
      }

      return populatedShift;
    } catch (error) {
      console.error("Error retrieving shift:", error);
      return null;
    }
  };
  public getShifts = async (
    userId: string | Types.ObjectId
  ): Promise<IShift[]> => {
    const shifts = await ShiftModel.find({ agentId: userId });
    return shifts;
  };

  public createShift = async (
    shiftData: IShift,
    shiftType
  ): Promise<IShift> => {
    console.log("Shift data:", shiftData);
    const newShift = ShiftModel.create({
      ...shiftData,
      shiftType,
    });
    return newShift;
  };

  public deleteShift = async (
    shiftId: string | Types.ObjectId
  ): Promise<void> => {
    await ShiftModel.findByIdAndDelete(shiftId);
  };

  public updateShift = async (
    shiftId: string,
    updatedShiftData: Partial<IShift>,
    shiftType: any
  ): Promise<IShift | null> => {
    const updatedShift = await ShiftModel.findByIdAndUpdate(
      shiftId,
      {
        ...updatedShiftData,
        shiftType,
      },
      { new: true }
    ).exec();

    return updatedShift;
  };

  // Assign users
  public assignUsers = async (
    shiftId: string,
    userIds: string[]
  ): Promise<IShift | null> => {
    try {
      const shift = await ShiftModel.findById(shiftId).exec();
      const existingUserIds = shift.assignedUsers.map((userId) =>
        userId.toString()
      );
      const isDuplicateUser = userIds.some((userId) =>
        existingUserIds.includes(userId)
      );

      if (isDuplicateUser) {
        throw new Error("User is already assigned to this shift");
      }

      if (!shift) {
        throw new Error("Shift not found");
      }

      if (userIds.length > shift.count) {
        throw new Error("Number of users exceeds the shift count");
      }

      shift.assignedUsers = userIds.map((userId) => new Types.ObjectId(userId));
      await shift.save();

      return shift;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export default ShiftService;
