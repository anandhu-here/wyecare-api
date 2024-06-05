import { Request, Response } from "express";
import StatusCodes from "src/constants/statusCodes";
import StringValues from "src/constants/strings";
import type { IShift } from "src/interfaces/entities/shift";
import ShiftService from "src/services/ShiftService";
import UserService from "src/services/UserService";

class ShiftController {
  private readonly _shiftSvc: ShiftService;
  private readonly _userSvc: UserService;

  constructor() {
    this._shiftSvc = new ShiftService();
    this._userSvc = new UserService();
  }

  public createShift = async (req: Request, res: Response): Promise<any> => {
    try {
      const shiftData: IShift = req.body;
      //   const assignedUser = await this._userSvc.findUserByIdExc()
      //   if (!assignedUser) {
      //     return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Assigned user not found' });
      //   }

      //   if (assignedUser.accountType === 'home' || assignedUser.accountType === 'agent') {
      //     return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Cannot assign shift to home or agent' });
      //   }

      const createdShift = await this._shiftSvc.createShift(shiftData);
      res.status(StatusCodes.CREATED).json(createdShift);
    } catch (error) {
      console.error("Error creating shift:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: StringValues.INTERNAL_SERVER_ERROR });
    }
  };

  public deleteShift = async (req: Request, res: Response): Promise<any> => {
    try {
      const { shiftId } = req.params;
      await this._shiftSvc.deleteShift(shiftId);
      res.status(StatusCodes.OK).json({ message: StringValues.SUCCESS });
    } catch (error) {
      console.error("Error deleting shift:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: StringValues.INTERNAL_SERVER_ERROR });
    }
  };

  public updateShift = async (req: Request, res: Response): Promise<any> => {
    try {
      const { shiftId } = req.params;
      const updatedShiftData: IShift = req.body;
      const updatedShift = await this._shiftSvc.updateShift(
        shiftId,
        updatedShiftData
      );
      res.status(StatusCodes.OK).json(updatedShift);
    } catch (error) {
      console.error("Error updating shift:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: StringValues.INTERNAL_SERVER_ERROR });
    }
  };
}

export default ShiftController;
