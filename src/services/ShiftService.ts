import type { IShift } from "src/interfaces/entities/shift";
import Logger from "src/logger";
import Shift from "src/models/Shift";

class ShiftService {
  private shifts: IShift[];

  constructor() {
    this.shifts = [];
  }

  public _createShift = async ({
    name,
    startTime,
    endTime,
    completed,
    createdAt,
    homeId,
    assignedAgentId,
  }: IShift): Promise<IShift> => {
    try {
      const shift = await Shift.create({
        name,
        startTime,
        endTime,
        completed,
        createdAt,
        homeId,
        assignedAgentId,
      });

      return Promise.resolve(shift);
    } catch (error) {
      Logger.error(
        "ShiftService: shiftCreateInit",
        "errorInfo:" + JSON.stringify(error)
      );
      return Promise.reject(error);
    }
  };

  public _init = async (): Promise<void> => {
    try {
      const shifts = await Shift.find();

      this.shifts = shifts;
    } catch (error) {
      Logger.error("ShiftService: init", "errorInfo:" + JSON.stringify(error));
    }
  };

  public createShift(shift: IShift): void {
    this.shifts.push(shift);
  }

  public getShifts(): IShift[] {
    return this.shifts;
  }

  public getShiftById(id: string): IShift | undefined {
    return this.shifts[0];
  }

  public updateShift(id: string, updatedShift: IShift): boolean {
    const index = this.shifts.findIndex((shift) => shift.id === id);

    if (index !== -1) {
      this.shifts[index] = updatedShift;
      return true;
    }

    return false;
  }

  public deleteShift(id: string): boolean {
    const index = this.shifts.findIndex((shift) => shift.id === id);

    if (index !== -1) {
      this.shifts.splice(index, 1);
      return true;
    }

    return false;
  }
}

export default ShiftService;
