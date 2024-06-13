import ShiftModel from "src/models/Shift";
import { Types } from "mongoose";
import type { IShift } from "src/interfaces/entities/shift";
import Logger from "src/logger";
import type { IShiftType } from "src/interfaces/entities/shift-types";

class ShiftService {
  public getPublishedShifts = async (
    userId: string | Types.ObjectId
  ): Promise<IShift[]> => {
    const shifts = await ShiftModel.find().populate("shiftType");
    return shifts;
  };

  public getunAcceptedShifts = async (userId: string): Promise<IShift[]> => {
    const shifts = await ShiftModel.find({
      homeId: userId,
      isAccepted: false,
    });
    console.log(shifts, "shifts");
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
    const shifts = await ShiftModel.find({ agentId: userId }).populate(
      "homeId"
    );
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
  public createMultipleShifts = async (
    shiftsData: IShift[],
    shiftTypes: IShiftType[],
    homeId: string
  ): Promise<IShift[]> => {
    const createdShifts: IShift[] = [];

    console.log(JSON.stringify(shiftsData));

    for (const shiftData of shiftsData) {
      const shiftType = shiftTypes.find((type) => {
        let shiftTypestr = type._id.toString();
        return shiftTypestr === shiftData.shiftType.toString();
      });

      if (shiftType) {
        const newShift = await ShiftModel.create({
          ...shiftData,
          shiftType,
          homeId,
        });
        createdShifts.push(newShift);
      }
    }

    return createdShifts;
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

  public acceptShift = async (shiftId: string): Promise<IShift | null> => {
    const updatedShift = await ShiftModel.findByIdAndUpdate(
      shiftId,
      {
        isAccepted: true,
        isRejected: false,
      },
      { new: true }
    ).exec();
    return updatedShift;
  };

  public rejectShift = async (shiftId: string): Promise<IShift | null> => {
    const updatedShift = await ShiftModel.findByIdAndUpdate(
      shiftId,
      {
        isRejected: true,
        agentId: undefined,
        isAccepted: false,
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
