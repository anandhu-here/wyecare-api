"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../enums");
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const strings_1 = __importDefault(require("../../constants/strings"));
const ApiError_1 = __importDefault(require("../../exceptions/ApiError"));
const logger_1 = __importDefault(require("../../logger"));
class UserShiftController {
    userShiftSvc;
    _userShiftSvc;
    constructor(userShiftSvc) {
        this.userShiftSvc = userShiftSvc;
        this._userShiftSvc = userShiftSvc;
    }
    createUserShiftsTypes = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.POST) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const currentUser = req.currentUser;
            const data = req.body;
            if (!data) {
                return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_BODY, statusCodes_1.default.BAD_REQUEST));
            }
            if (data.shifts.length === 0) {
                return next(new ApiError_1.default(strings_1.default.SHIFT_TYPE_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            const newUserShiftData = {
                userId: currentUser._id,
                shifttypes: data.shifts,
            };
            const userShift = await this._userShiftSvc.createExc(newUserShiftData);
            return res.status(statusCodes_1.default.CREATED).json({
                success: true,
                message: strings_1.default.SUCCESS,
                data: userShift,
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.error("UserShiftController: createUserShifts", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
    getUserShiftTypes = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.GET) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const currentUser = req.currentUser;
            const userShift = await this._userShiftSvc.findByUserIdExc(currentUser._id);
            if (!userShift) {
                return res.status(statusCodes_1.default.NOT_FOUND).json({
                    success: false,
                    message: strings_1.default.USER_SHIFT_TYPE_NOT_FOUND,
                });
            }
            return res.status(statusCodes_1.default.OK).json({
                success: true,
                message: strings_1.default.SUCCESS,
                data: userShift,
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.error("UserShiftController: getUserShiftTypes", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
    deleteShiftType = async (req, res) => {
        try {
            const { shiftTypeId } = req.params;
            const userId = req.currentUser._id;
            if (!userId) {
                return res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "User ID is required" });
            }
            if (!shiftTypeId) {
                return res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "Shift type ID is required" });
            }
            const deletedShiftType = await this._userShiftSvc.deleteShiftType(userId, shiftTypeId);
            console.log("deletedShiftType", deletedShiftType);
            res
                .status(statusCodes_1.default.OK)
                .json({ message: strings_1.default.SUCCESS, data: deletedShiftType });
        }
        catch (error) {
            console.error("Error deleting shift type:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
    deleteUserShift = async (req, res) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "User ID is required" });
            }
            const deletedUserShift = await this._userShiftSvc.deleteUserShift(userId);
            console.log("deletedUserShift", deletedUserShift);
            res.status(statusCodes_1.default.OK).json({ message: strings_1.default.SUCCESS });
        }
        catch (error) {
            console.error("Error deleting user shift:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
    editShiftType = async (req, res) => {
        try {
            const userId = req.currentUser._id;
            const { shiftTypeId } = req.params;
            const { data } = req.body;
            if (!userId) {
                return res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "User ID is required" });
            }
            if (!shiftTypeId) {
                return res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "Shift type ID is required" });
            }
            if (!data) {
                return res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "Updated shift type is required" });
            }
            const userShift = await this._userShiftSvc.editShiftType(userId, shiftTypeId, data);
            console.log("data", userShift);
            res
                .status(statusCodes_1.default.OK)
                .json({ message: strings_1.default.SUCCESS, data: userShift });
        }
        catch (error) {
            console.error("Error updating shift type:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
}
exports.default = UserShiftController;
//# sourceMappingURL=ShiftTypeConrtoller.js.map