"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Timesheet_1 = __importDefault(require("../models/Timesheet"));
const Shift_1 = __importDefault(require("src/models/Shift"));
const date_fns_1 = require("date-fns");
class TimesheetService {
    createTimesheet = async (shiftId, carerId) => {
        const shift = await Shift_1.default.findById(shiftId)
            .populate({
            path: "shiftType",
            select: "name startTime endTime",
        })
            .exec();
        if (!shift) {
            throw new Error("Shift not found");
        }
        const currentTime = new Date();
        const shiftEndTime = (0, date_fns_1.parseISO)(`${shift.date}T${shift.shiftType.endtime}`);
        const oneHourBeforeEnd = (0, date_fns_1.addHours)(shiftEndTime, -1);
        if (currentTime >= oneHourBeforeEnd) {
            throw new Error("Cannot create a timesheet within 1 hour of the shift end time");
        }
        const timesheet = await Timesheet_1.default.create({
            shiftId,
            carerId,
            homeId: shift.homeId,
        });
        return timesheet;
    };
    getTimesheets = async (accountType, userId) => {
        try {
            let timesheets;
            if (accountType === "carer") {
                timesheets = await Timesheet_1.default.find({
                    carerId: userId,
                })
                    .populate({
                    path: "shiftId",
                    select: "shiftType homeId date startTime endTime",
                    populate: {
                        path: "homeId",
                        select: "company",
                    },
                })
                    .populate({
                    path: "carerId",
                    select: "fname lname _id",
                });
                console.log(timesheets, "timesheets");
            }
            else {
                timesheets = await Timesheet_1.default.find({
                    homeId: userId,
                })
                    .populate({
                    path: "shiftId",
                    select: "shiftType homeId date startTime endTime",
                })
                    .populate({
                    path: "carerId",
                    select: "fname lname _id",
                });
            }
            return timesheets;
        }
        catch (error) {
            console.error("Error getting timesheets:", error);
            throw error;
        }
    };
    getTimesheetsByHomeId = async (homeId) => {
        const timesheets = await Timesheet_1.default.find({
            "shift.homeId": homeId,
        })
            .populate("shift")
            .exec();
        return timesheets;
    };
    approveTimesheet = async (timesheetId, rating = null, review = null) => {
        const updatedTimesheet = await Timesheet_1.default.findByIdAndUpdate(timesheetId, {
            status: "approved",
            rating: rating !== null ? rating : null,
            review: review !== null ? review : null,
        }, { new: true }).exec();
        return updatedTimesheet;
    };
    rejectTimesheet = async (timesheetId) => {
        const updatedTimesheet = await Timesheet_1.default.findByIdAndUpdate(timesheetId, {
            status: "rejected",
        }, { new: true }).exec();
        return updatedTimesheet;
    };
}
exports.default = TimesheetService;
//# sourceMappingURL=TimesheetService.js.map