"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shiftController_1 = __importDefault(require("./shiftController"));
const Auth_1 = __importDefault(require("src/middlewares/Auth"));
const shift_1 = __importDefault(require("src/middlewares/shift"));
const shift_2 = __importDefault(require("src/validators/shift"));
const ShiftRouter = (0, express_1.Router)();
const _shiftController = new shiftController_1.default();
ShiftRouter.route("/").get(Auth_1.default.isAuthenticatedUser, _shiftController.getShifts);
ShiftRouter.route("/unaccepted").get(Auth_1.default.isAuthenticatedUser, _shiftController.getUnAcceptedShifts);
ShiftRouter.route("/:shiftId").get(Auth_1.default.isAuthenticatedUser, _shiftController.getShiftById);
ShiftRouter.route("/").post(Auth_1.default.isAuthenticatedUser, _shiftController.createShift);
ShiftRouter.route("/multiple").post(Auth_1.default.isAuthenticatedUser, _shiftController.createMultipleShifts);
ShiftRouter.route("/:shiftId").delete(Auth_1.default.isAuthenticatedUser, _shiftController.deleteShift);
ShiftRouter.route("/:shiftId").put(Auth_1.default.isAuthenticatedUser, _shiftController.updateShift);
ShiftRouter.route("/:shiftId/assign").put(Auth_1.default.isAuthenticatedUser, _shiftController.assignUsers);
ShiftRouter.route("/:shiftId/accept").put(Auth_1.default.isAuthenticatedUser, shift_2.default, _shiftController.acceptShift);
ShiftRouter.route("/:shiftId/reject").put(Auth_1.default.isAuthenticatedUser, _shiftController.rejectShift);
ShiftRouter.route("/assign-carers").post(Auth_1.default.isAuthenticatedUser, shift_1.default.validateAssignCarers, _shiftController.assignCarersToShift);
ShiftRouter.route("/:shiftId/unassign-carer").post(Auth_1.default.isAuthenticatedUser, shift_1.default.validateUnassignCarer, _shiftController.unassignCarerFromShift);
ShiftRouter.route("/:shiftId/generateQR").post(Auth_1.default.isAuthenticatedUser, _shiftController.generateQRCode);
exports.default = ShiftRouter;
//# sourceMappingURL=Route.js.map