"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const ShiftTypeConrtoller_1 = __importDefault(require("./ShiftTypeConrtoller"));
const ShiftTypeService_1 = __importDefault(require("../../services/ShiftTypeService"));
const ShiftTypeRouter = (0, express_1.Router)();
const shiftTypeSvc = new ShiftTypeService_1.default();
const shiftTypeCtlr = new ShiftTypeConrtoller_1.default(shiftTypeSvc);
ShiftTypeRouter.route("/init").post(Auth_1.default.isAuthenticatedUser, shiftTypeCtlr.createUserShiftsTypes);
ShiftTypeRouter.route("/:shiftTypeId/one").delete(Auth_1.default.isAuthenticatedUser, shiftTypeCtlr.deleteShiftType);
ShiftTypeRouter.route("/:userId").delete(Auth_1.default.isAuthenticatedUser, shiftTypeCtlr.deleteUserShift);
ShiftTypeRouter.route("/:shiftTypeId").put(Auth_1.default.isAuthenticatedUser, shiftTypeCtlr.editShiftType);
ShiftTypeRouter.route("/").get(Auth_1.default.isAuthenticatedUser, shiftTypeCtlr.getUserShiftTypes);
exports.default = ShiftTypeRouter;
//# sourceMappingURL=Route.js.map