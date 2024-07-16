"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TimesheetController_1 = __importDefault(require("./TimesheetController"));
const Auth_1 = __importDefault(require("src/middlewares/Auth"));
const timesheet_1 = __importDefault(require("src/middlewares/timesheet"));
const TimesheetRouter = (0, express_1.Router)();
const _timesheetController = new TimesheetController_1.default();
TimesheetRouter.route("/").get(Auth_1.default.isAuthenticatedUser, _timesheetController.getTimesheets);
TimesheetRouter.route("/").post(Auth_1.default.isAuthenticatedUser, timesheet_1.default.validateCreateTimesheet, _timesheetController.createTimesheet);
TimesheetRouter.route("/:timesheetId/approve").patch(Auth_1.default.isAuthenticatedUser, timesheet_1.default.validateApproval, _timesheetController.approveTimesheet);
TimesheetRouter.route("/:timesheetId/reject").get(Auth_1.default.isAuthenticatedUser, timesheet_1.default.validateApproval, _timesheetController.rejectTimesheet);
exports.default = TimesheetRouter;
//# sourceMappingURL=Route.js.map