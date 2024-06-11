import { Request, Response } from "express";
import StatusCodes from "src/constants/statusCodes";
import StringValues from "src/constants/strings";
import type { IRequest, IResponse } from "src/interfaces/core/express";
import ShiftService from "src/services/ShiftService";
import UserService from "src/services/UserService";
import { Types, type ObjectId } from "mongoose";
import type { IShift } from "src/interfaces/entities/shift";
import UserShiftTypeService from "src/services/ShiftTypeService";

class ShiftController {
  private readonly _shiftSvc: ShiftService;
  private readonly _userSvc: UserService;
  private readonly _shiftTypeSvc: UserShiftTypeService;

  constructor() {
    this._shiftSvc = new ShiftService();
    this._userSvc = new UserService();
    this._shiftTypeSvc = new UserShiftTypeService();
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
  public getUnAcceptedShifts = async (
    req: IRequest,
    res: IResponse
  ): Promise<void> => {
    try {
      const currentUser = req.currentUser;

      let shifts: IShift[] = [];

      if (currentUser.accountType !== "home") {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Cannot get unaccepted shifts" });
        return;
      }

      shifts = await this._shiftSvc.getunAcceptedShifts(
        currentUser._id as string
      );

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
      let shiftData = req.body;
      const currentUser = req.currentUser;

      if (currentUser.accountType !== "home") {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Cannot create shift" });
        return;
      }

      const shiftTypeExists = await this._shiftTypeSvc.checkShiftType(
        currentUser._id as string
      );

      if (!shiftTypeExists) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Shift type does not exist kkk" });
        return;
      }

      // Find the specific ShiftTypeSchema object within the shifttypes array

      const shiftType = shiftTypeExists.shifttypes.find((type) => {
        let shiftTypestr = type._id.toString();
        return shiftTypestr === shiftData.shiftType.toString();
      });

      if (!shiftType) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Shift type does not exist" });
        return;
      }
      shiftData.homeId = currentUser._id.toString();

      const createdShift = await this._shiftSvc.createShift(
        shiftData,
        shiftType
      );
      res.status(StatusCodes.CREATED).json(createdShift);
    } catch (error) {
      console.error("Error creating shift:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: StringValues.INTERNAL_SERVER_ERROR });
    }
  };

  public createMultipleShifts = async (
    req: IRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { shiftsData } = req.body;
      const currentUser = req.currentUser;

      if (currentUser.accountType !== "home") {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Cannot create shifts" });
        return;
      }

      const shiftTypeExists = await this._shiftTypeSvc.checkShiftType(
        currentUser._id as string
      );

      if (!shiftTypeExists) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Shift type does not exist" });
        return;
      }

      const createdShifts = await this._shiftSvc.createMultipleShifts(
        shiftsData,
        shiftTypeExists.shifttypes,
        currentUser._id.toString()
      );

      res.status(StatusCodes.CREATED).json(createdShifts);
    } catch (error) {
      console.error("Error creating shifts:", error);
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
      const shiftId = req.params.shiftId;
      const updatedShiftData = req.body;
      const currentUser = req.currentUser;

      const shift = await this._shiftSvc.getShiftById(shiftId);

      if (!shift) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Shift not found" });
        return;
      }

      if (shift.homeId.toString() !== currentUser._id.toString()) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Not authorized to update this shift" });
        return;
      }

      const shiftTypeExists = await this._shiftTypeSvc.checkShiftType(
        currentUser._id as string
      );

      if (!shiftTypeExists) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Shift type does not exist" });
        return;
      }

      const shiftType = shiftTypeExists.shifttypes.find((type) => {
        let shiftTypestr = type._id.toString();
        return shiftTypestr === updatedShiftData.shiftType.toString();
      });

      if (!shiftType) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Shift type does not exist" });
        return;
      }

      const updatedShift = await this._shiftSvc.updateShift(
        shiftId,
        updatedShiftData,
        shiftType
      );

      res.status(StatusCodes.OK).json(updatedShift);
    } catch (error) {
      console.error("Error updating shift:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: StringValues.INTERNAL_SERVER_ERROR });
    }
  };

  public acceptShift = async (req: IRequest, res: Response): Promise<void> => {
    try {
      const shiftId = req.params.shiftId;
      const currentUser = req.currentUser;

      const shift = await this._shiftSvc.getShiftById(shiftId);

      if (!shift) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Shift not found" });
        return;
      }
      const updatedShift = await this._shiftSvc.acceptShift(shiftId);

      res.status(StatusCodes.OK).json(updatedShift);
    } catch (error) {
      console.error("Error accepting shift:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: StringValues.INTERNAL_SERVER_ERROR });
    }
  };

  public rejectShift = async (req: IRequest, res: Response): Promise<void> => {
    try {
      const shiftId = req.params.shiftId;
      const currentUser = req.currentUser;

      const shift = await this._shiftSvc.getShiftById(shiftId);

      if (!shift) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Shift not found" });
        return;
      }

      if (shift.agentId.toString() !== currentUser._id.toString()) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Not authorized to reject this shift" });
        return;
      }

      const updatedShift = await this._shiftSvc.rejectShift(shiftId);

      res.status(StatusCodes.OK).json(updatedShift);
    } catch (error) {
      console.error("Error rejecting shift:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: StringValues.INTERNAL_SERVER_ERROR });
    }
  };

  // Assign a user to a shift

  public assignUsers = async (req: IRequest, res: Response): Promise<void> => {
    try {
      const shiftId = req.params.shiftId;
      const userIds = req.body.userIds;
      const currentUser = req.currentUser;

      const shift = await this._shiftSvc.getShiftById(shiftId);

      console.log("Shift:", shift);

      if (!shift) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Shift not found" });
        return;
      }

      if (shift.homeId.toString() !== currentUser._id.toString()) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Not authorized to assign users to this shift" });
        return;
      }

      if (!Array.isArray(userIds) || userIds.length === 0) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid user IDs" });
        return;
      }

      const updatedShift = await this._shiftSvc.assignUsers(shiftId, userIds);

      res.status(StatusCodes.OK).json(updatedShift);
    } catch (error) {
      console.error(error, "andi");
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  };
}

export default ShiftController;
