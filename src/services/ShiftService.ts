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

  public createShift = async (shiftData: IShift): Promise<IShift> => {
    const createdShift = await ShiftModel.create(shiftData);
    return createdShift;
  };

  public deleteShift = async (
    shiftId: string | Types.ObjectId
  ): Promise<void> => {
    await ShiftModel.findByIdAndDelete(shiftId);
  };

  public updateShift = async (
    shiftId: string | Types.ObjectId,
    updatedShiftData: Partial<IShift>
  ): Promise<IShift | null> => {
    const updatedShift = await ShiftModel.findByIdAndUpdate(
      shiftId,
      updatedShiftData,
      { new: true }
    );
    return updatedShift;
  };
}

export default ShiftService;
