import type { IShift } from "src/interfaces/entities/shift";
import ShiftModel from "src/models/Shift";

class ShiftService {
  public createShift = async (shiftData: IShift): Promise<IShift> => {
    const createdShift = await ShiftModel.create(shiftData);
    return createdShift;
  };

  public deleteShift = async (shiftId: string): Promise<void> => {
    await ShiftModel.findByIdAndDelete(shiftId);
  };

  public updateShift = async (
    shiftId: string,
    updatedShiftData: IShift
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
