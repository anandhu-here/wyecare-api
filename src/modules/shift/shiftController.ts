import { Request, Response } from "express";
import StatusCodes from "src/constants/statusCodes";
import StringValues from "src/constants/strings";
import type { IRequest } from "src/interfaces/core/express";
import ShiftService from "src/services/ShiftService";
import UserService from "src/services/UserService";
import { Types, type ObjectId } from "mongoose";
import type { IShift } from "src/interfaces/entities/shift";

class ShiftController {
  private readonly _shiftSvc: ShiftService;
  private readonly _userSvc: UserService;

  constructor() {
    this._shiftSvc = new ShiftService();
    this._userSvc = new UserService();
  }

  public getShiftById = async (req: IRequest, res: Response): Promise<void> => {
    try {
      const { shiftId } = req.params;
      const shift = await this._shiftSvc.getShiftById(shiftId);
      res.status(StatusCodes.OK).json(shift);
    } catch (error) {
      console.error("Error getting shift by id:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: StringValues.INTERNAL_SERVER_ERROR });
    }
  };

  public getShifts = async (req: IRequest, res: Response): Promise<void> => {
    try {
      const currentUser = req.currentUser;

      let shifts: IShift[] = [];

      if (currentUser.accountType === "agency") {
        shifts = await this._shiftSvc.getPublishedShifts(
          currentUser._id as string
        );
        console.log(shifts, "shifts");
      } else {
        shifts = await this._shiftSvc.getShifts(currentUser._id as string);
      }

      res.status(StatusCodes.OK).json(shifts);
    } catch (error) {
      console.error("Error getting shifts:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: StringValues.INTERNAL_SERVER_ERROR });
    }
  };

  public createShift = async (req: IRequest, res: Response): Promise<void> => {
    try {
      let shiftData: IShift = req.body;
      const currentUser = req.currentUser;

      if (currentUser.accountType !== "home") {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Cannot create shift" });
        return;
      }

      shiftData.homeId = currentUser._id as ObjectId;

      const createdShift = await this._shiftSvc.createShift(shiftData);
      res.status(StatusCodes.CREATED).json(createdShift);
    } catch (error) {
      console.error("Error creating shift:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: StringValues.INTERNAL_SERVER_ERROR });
    }
  };

  public deleteShift = async (req: IRequest, res: Response): Promise<void> => {
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

  public updateShift = async (req: IRequest, res: Response): Promise<void> => {
    try {
      const { shiftId } = req.params;
      const updatedShiftData: Partial<IShift> = req.body;
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
