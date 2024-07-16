"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = __importDefault(require("src/constants/statusCodes"));
const TimesheetService_1 = __importDefault(require("src/services/TimesheetService"));
class TimesheetController {
    _timesheetService;
    constructor() {
        this._timesheetService = new TimesheetService_1.default();
    }
    createTimesheet = async (req, res) => {
        try {
            const { shiftId } = req.body;
            if (!shiftId) {
                res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "Shift ID is required" });
                return;
            }
            const carerId = req.currentUser._id;
            const timesheet = await this._timesheetService.createTimesheet(shiftId, carerId);
            res.status(statusCodes_1.default.CREATED).json(timesheet);
        }
        catch (error) {
            console.error("Error creating timesheet:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };
    getTimesheets = async (req, res) => {
        try {
            const timesheets = await this._timesheetService.getTimesheets(req.currentUser.accountType, req.currentUser._id);
            res.status(statusCodes_1.default.OK).json(timesheets || []);
        }
        catch (error) {
            console.error("Error getting timesheets:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };
    getTimesheetsByHomeId = async (req, res) => {
        try {
            const homeId = req.currentUser._id;
            const timesheets = await this._timesheetService.getTimesheetsByHomeId(homeId);
            res.status(statusCodes_1.default.OK).json(timesheets);
        }
        catch (error) {
            console.error("Error getting timesheets by home ID:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };
    approveTimesheet = async (req, res) => {
        try {
            const { timesheetId } = req.params;
            const { rating, review } = req.body;
            const updatedTimesheet = await this._timesheetService.approveTimesheet(timesheetId, rating, review);
            if (!updatedTimesheet) {
                res
                    .status(statusCodes_1.default.NOT_FOUND)
                    .json({ message: "Timesheet not found" });
                return;
            }
            res.status(statusCodes_1.default.OK).json(updatedTimesheet);
        }
        catch (error) {
            console.error("Error approving timesheet:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };
    rejectTimesheet = async (req, res) => {
        try {
            const { timesheetId } = req.params;
            const updatedTimesheet = await this._timesheetService.rejectTimesheet(timesheetId);
            if (!updatedTimesheet) {
                res
                    .status(statusCodes_1.default.NOT_FOUND)
                    .json({ message: "Timesheet not found" });
                return;
            }
            res.status(statusCodes_1.default.OK).json(updatedTimesheet);
        }
        catch (error) {
            console.error("Error rejecting timesheet:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };
}
exports.default = TimesheetController;
//# sourceMappingURL=TimesheetController.js.map