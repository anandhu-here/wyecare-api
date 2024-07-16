"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = __importDefault(require("src/constants/statusCodes"));
const strings_1 = __importDefault(require("src/constants/strings"));
const ShiftService_1 = __importDefault(require("src/services/ShiftService"));
const mongoose_1 = require("mongoose");
const ShiftTypeService_1 = __importDefault(require("src/services/ShiftTypeService"));
const logger_1 = __importDefault(require("src/logger"));
class ShiftController {
    _shiftSvc;
    _shiftTypeSvc;
    constructor() {
        this._shiftSvc = new ShiftService_1.default();
        this._shiftTypeSvc = new ShiftTypeService_1.default();
    }
    getShiftById = async (req, res) => {
        try {
            const { shiftId } = req.params;
            const shift = await this._shiftSvc.getShiftById(shiftId);
            res.status(statusCodes_1.default.OK).json(shift);
        }
        catch (error) {
            console.error("Error getting shift by id:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    };
    getShifts = async (req, res) => {
        try {
            const currentUser = req.currentUser;
            let shifts = [];
            if (currentUser.accountType === "home" ||
                currentUser.accountType === "nurse") {
                shifts = await this._shiftSvc.getPublishedShifts(currentUser._id);
            }
            else if (currentUser.accountType === "agency") {
                shifts = await this._shiftSvc.getShifts(currentUser._id);
            }
            else if (currentUser.accountType === "carer") {
                shifts = await this._shiftSvc.getAssignedShifts(currentUser._id);
            }
            res.status(statusCodes_1.default.OK).json(shifts);
        }
        catch (error) {
            console.error("Error getting shifts:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    };
    getUnAcceptedShifts = async (req, res) => {
        try {
            const currentUser = req.currentUser;
            let shifts = [];
            if (currentUser.accountType !== "home") {
                res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "Cannot get unaccepted shifts" });
                return;
            }
            shifts = await this._shiftSvc.getunAcceptedShifts(currentUser._id);
            res.status(statusCodes_1.default.OK).json(shifts);
        }
        catch (error) {
            console.error("Error getting shifts:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    };
    createShift = async (req, res) => {
        try {
            let shiftData = req.body;
            const currentUser = req.currentUser;
            if (currentUser.accountType !== "home") {
                res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "Cannot create shift" });
                return;
            }
            const shiftTypeExists = await this._shiftTypeSvc.checkShiftType(currentUser._id);
            if (!shiftTypeExists) {
                res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "Shift type does not exist kkk" });
                return;
            }
            const shiftType = shiftTypeExists.shifttypes.find((type) => {
                let shiftTypestr = type._id.toString();
                return shiftTypestr === shiftData.shiftType.toString();
            });
            if (!shiftType) {
                res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "Shift type does not exist" });
                return;
            }
            shiftData.homeId = currentUser._id.toString();
            const createdShift = await this._shiftSvc.createShift(shiftData, shiftType);
            res.status(statusCodes_1.default.CREATED).json(createdShift);
        }
        catch (error) {
            console.error("Error creating shift:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    };
    createMultipleShifts = async (req, res) => {
        try {
            const { shiftsData } = req.body;
            const currentUser = req.currentUser;
            if (currentUser.accountType !== "home") {
                res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "Cannot create shifts" });
                return;
            }
            const shiftTypeExists = await this._shiftTypeSvc.checkShiftType(currentUser._id);
            if (!shiftTypeExists) {
                res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "Shift type does not exist" });
                return;
            }
            console.log("Shifts data:", shiftsData);
            const createdShifts = await this._shiftSvc.createMultipleShifts(shiftsData, shiftTypeExists.shifttypes, currentUser._id.toString());
            res.status(statusCodes_1.default.CREATED).json(createdShifts);
        }
        catch (error) {
            console.error("Error creating shifts:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    };
    deleteShift = async (req, res) => {
        try {
            const { shiftId } = req.params;
            const shift = await this._shiftSvc.deleteShift(shiftId);
            res
                .status(statusCodes_1.default.OK)
                .json({ message: strings_1.default.SUCCESS, shift: shift });
        }
        catch (error) {
            console.error("Error deleting shift:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    };
    updateShift = async (req, res) => {
        try {
            const shiftId = req.params.shiftId;
            const updatedShiftData = req.body;
            const currentUser = req.currentUser;
            const shift = await this._shiftSvc.getShiftById(shiftId);
            if (!shift) {
                res.status(statusCodes_1.default.NOT_FOUND).json({ message: "Shift not found" });
                return;
            }
            if (shift.homeId.toString() !== currentUser._id.toString()) {
                res
                    .status(statusCodes_1.default.UNAUTHORIZED)
                    .json({ message: "Not authorized to update this shift" });
                return;
            }
            const shiftTypeExists = await this._shiftTypeSvc.checkShiftType(currentUser._id);
            if (!shiftTypeExists) {
                res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "Shift type does not exist" });
                return;
            }
            const shiftType = shiftTypeExists.shifttypes.find((type) => {
                let shiftTypestr = type._id.toString();
                return shiftTypestr === updatedShiftData.shiftType.toString();
            });
            if (!shiftType) {
                res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "Shift type does not exist" });
                return;
            }
            const updatedShift = await this._shiftSvc.updateShift(shiftId, updatedShiftData, shiftType);
            res.status(statusCodes_1.default.OK).json(updatedShift);
        }
        catch (error) {
            console.error("Error updating shift:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    };
    acceptShift = async (req, res) => {
        try {
            const shiftId = req.params.shiftId;
            const shift = await this._shiftSvc.getShiftById(shiftId);
            if (!shift) {
                res.status(statusCodes_1.default.NOT_FOUND).json({ message: "Shift not found" });
                return;
            }
            const updatedShift = await this._shiftSvc.acceptShift(shiftId);
            res.status(statusCodes_1.default.OK).json(updatedShift);
        }
        catch (error) {
            console.error("Error accepting shift:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    };
    rejectShift = async (req, res) => {
        try {
            const shiftId = req.params.shiftId;
            const currentUser = req.currentUser;
            const shift = await this._shiftSvc.getShiftById(shiftId);
            if (!shift) {
                res.status(statusCodes_1.default.NOT_FOUND).json({ message: "Shift not found" });
                return;
            }
            if (shift.agentId.toString() !== currentUser._id.toString()) {
                res
                    .status(statusCodes_1.default.UNAUTHORIZED)
                    .json({ message: "Not authorized to reject this shift" });
                return;
            }
            const updatedShift = await this._shiftSvc.rejectShift(shiftId);
            res.status(statusCodes_1.default.OK).json(updatedShift);
        }
        catch (error) {
            console.error("Error rejecting shift:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    };
    assignUsers = async (req, res) => {
        try {
            const shiftId = req.params.shiftId;
            const userIds = req.body.userIds;
            const currentUser = req.currentUser;
            const shift = await this._shiftSvc.getShiftById(shiftId);
            console.log("Shift:", shift);
            if (!shift) {
                res.status(statusCodes_1.default.NOT_FOUND).json({ message: "Shift not found" });
                return;
            }
            if (shift.homeId.toString() !== currentUser._id.toString()) {
                res
                    .status(statusCodes_1.default.UNAUTHORIZED)
                    .json({ message: "Not authorized to assign users to this shift" });
                return;
            }
            if (!Array.isArray(userIds) || userIds.length === 0) {
                res
                    .status(statusCodes_1.default.BAD_REQUEST)
                    .json({ message: "Invalid user IDs" });
                return;
            }
            const updatedShift = await this._shiftSvc.assignUsers(shiftId, userIds);
            res.status(statusCodes_1.default.OK).json(updatedShift);
        }
        catch (error) {
            console.error(error, "andi");
            res.status(statusCodes_1.default.BAD_REQUEST).json({ message: error });
        }
    };
    assignCarersToShift = async (req, res) => {
        try {
            const currentUser = req.currentUser;
            const { shiftId, carerIds } = req.body;
            if (currentUser.accountType !== "agency") {
                res
                    .status(statusCodes_1.default.FORBIDDEN)
                    .json({ message: "Only agencies can assign carers to shifts" });
                return;
            }
            const linkedCarerIds = currentUser.linkedUsers
                .find((linkedUser) => linkedUser.accountType === "carer")
                ?.users.map((userId) => userId.toString());
            const validCarerIds = carerIds.filter((carerId) => linkedCarerIds?.includes(carerId));
            if (validCarerIds.length !== carerIds.length) {
                res.status(statusCodes_1.default.BAD_REQUEST).json({
                    message: "Some of the provided carer IDs are not linked to the agency",
                });
                return;
            }
            const objectValidCarerIds = validCarerIds.map((carerId) => new mongoose_1.Types.ObjectId(carerId));
            const updatedShift = await this._shiftSvc.assignCarersToShift(shiftId, objectValidCarerIds);
            if (!updatedShift) {
                res.status(statusCodes_1.default.NOT_FOUND).json({ message: "Shift not found" });
                return;
            }
            res.status(statusCodes_1.default.OK).json({
                message: "Carers assigned to shift successfully",
                shift: updatedShift,
            });
        }
        catch (error) {
            console.error("Error assigning carers to shift:", error);
            res.status(statusCodes_1.default.BAD_REQUEST).json({ message: error });
        }
    };
    unassignCarerFromShift = async (req, res) => {
        try {
            const { shiftId } = req.params;
            const { carerId } = req.body;
            const updatedShift = await this._shiftSvc.unassignCarerFromShift(shiftId, carerId);
            if (!updatedShift) {
                res.status(404).json({ message: "Shift not found" });
                return;
            }
            res.status(200).json({
                message: "Carer unassigned from shift successfully",
                shift: updatedShift,
            });
        }
        catch (error) {
            console.error("Error unassigning carer from shift:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
    generateQRCode = async (req, res) => {
        try {
            const { shiftId } = req.params;
            if (req.currentUser.accountType !== "nurse") {
                res
                    .status(statusCodes_1.default.FORBIDDEN)
                    .json({ message: "Only nurses can generate QR codes" });
                return;
            }
            const qrCodeData = await this._shiftSvc.generateQRCode(shiftId);
            logger_1.default.info("QR code data:", qrCodeData);
            res.status(200).json(qrCodeData);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to generate QR code" });
        }
    };
    verifyPublicKey = async (req, res) => {
        try {
            const { shiftId } = req.params;
            const { publicKey, carerId } = req.body;
            const result = await this._shiftSvc.verifyPublicKey(shiftId, publicKey, carerId);
            res.status(200).json({ success: result });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to verify public key" });
        }
    };
}
exports.default = ShiftController;
//# sourceMappingURL=shiftController.js.map