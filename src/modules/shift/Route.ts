import { Router } from "express";
import ShiftController from "./shiftController";
import AuthMiddleware from "src/middlewares/Auth";
import { validateShiftRequest } from "src/middlewares/shift";
import { createShiftSchema } from "src/validators/shift";

const ShiftRouter: Router = Router();
const _shiftController = new ShiftController();

/**
 * @name ShiftController.getShifts
 * @description Get all shifts.
 * @route GET /api/v1/shifts
 * @access private
 */
ShiftRouter.route("/").get(
  AuthMiddleware.isAuthenticatedUser,
  _shiftController.getShifts
);

/**
 * @name ShiftController.getShift
 * @description Get a shift by ID.
 * @route GET /api/v1/shifts/:shiftId
 * @access private
 */

ShiftRouter.route("/:shiftId").get(
  AuthMiddleware.isAuthenticatedUser,
  _shiftController.getShiftById
);

/**
 * @name ShiftController.createShift
 * @description Create a new shift.
 * @route POST /api/v1/shifts
 * @access private
 */
ShiftRouter.route("/").post(
  validateShiftRequest(createShiftSchema),
  AuthMiddleware.isAuthenticatedUser,
  _shiftController.createShift
);

/**
 * @name ShiftController.deleteShift
 * @description Delete a shift.
 * @route DELETE /api/v1/shifts/:shiftId
 * @access private
 */
ShiftRouter.route("/:shiftId").delete(
  AuthMiddleware.isAuthenticatedUser,
  _shiftController.deleteShift
);

/**
 * @name ShiftController.updateShift
 * @description Update a shift.
 * @route PUT /api/v1/shifts/:shiftId
 * @access private
 */
ShiftRouter.route("/:shiftId").put(
  AuthMiddleware.isAuthenticatedUser,
  _shiftController.updateShift
);

export default ShiftRouter;
