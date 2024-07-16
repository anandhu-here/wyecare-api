"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Shift_1 = __importDefault(require("src/models/Shift"));
const mongoose_1 = require("mongoose");
const statusCodes_1 = __importDefault(require("src/constants/statusCodes"));
const ErrorHelper_1 = __importDefault(require("src/helpers/ErrorHelper"));
const node_rsa_1 = __importDefault(require("node-rsa"));
const qrcode_1 = __importDefault(require("qrcode"));
const Timesheet_1 = __importDefault(require("src/models/Timesheet"));
const logger_1 = __importDefault(require("src/logger"));
class ShiftService {
    getPublishedShifts = async (userId) => {
        const shifts = await Shift_1.default.find({
            homeId: userId,
        })
            .populate("shiftType")
            .populate({
            path: "homeId",
            select: "_id company",
        })
            .populate({
            path: "assignedUsers",
            select: "_id fname lname",
        })
            .populate({
            path: "agentId",
            select: "_id company",
        });
        return shifts;
    };
    getAssignedShifts = async (userId) => {
        try {
            const shifts = await Shift_1.default.find({
                assignedUsers: new mongoose_1.Types.ObjectId(userId),
            })
                .populate("shiftType")
                .populate({
                path: "homeId",
                select: "_id company",
            })
                .populate({
                path: "assignedUsers",
                select: "_id fname lname",
            })
                .populate({
                path: "agentId",
                select: "_id company",
            })
                .exec();
            const shiftPromises = shifts.map(async (shift) => {
                const timesheet = await Timesheet_1.default.findOne({
                    shiftId: shift._id,
                    carerId: userId,
                });
                return { ...shift.toObject(), timesheet: timesheet || null };
            });
            logger_1.default.info("Shifts:", shiftPromises);
            return await Promise.all(shiftPromises);
        }
        catch (error) {
            console.error("Error getting shifts by assigned user:", error);
            throw new Error(`Failed to get shifts by assigned user`);
        }
    };
    getunAcceptedShifts = async (userId) => {
        const shifts = await Shift_1.default.find({
            homeId: userId,
            isAccepted: false,
        });
        console.log(shifts, "shifts");
        return shifts;
    };
    getShiftById = async (shiftId) => {
        try {
            const shift = await Shift_1.default.findById(shiftId).exec();
            console.log("Shift without populate:", shift);
            const populatedShift = await Shift_1.default.findById(shiftId)
                .populate("shiftType")
                .exec();
            console.log("Shift with populate:", populatedShift);
            if (!populatedShift) {
                console.log("Shift not found");
                return null;
            }
            return populatedShift;
        }
        catch (error) {
            console.error("Error retrieving shift:", error);
            return null;
        }
    };
    getShifts = async (userId) => {
        const shifts = await Shift_1.default.find({ agentId: userId })
            .populate({
            path: "homeId",
            select: "_id company",
        })
            .populate({
            path: "assignedUsers",
            select: "_id fname lname",
        })
            .populate({
            path: "agentId",
            select: "_id company",
        });
        return shifts;
    };
    createShift = async (shiftData, shiftType) => {
        console.log("Shift data:", shiftData);
        const newShift = Shift_1.default.create({
            ...shiftData,
            shiftType,
        });
        return newShift;
    };
    createMultipleShifts = async (shiftsData, shiftTypes, homeId) => {
        const createdShifts = [];
        for (const shiftData of shiftsData) {
            const shiftType = shiftTypes.find((type) => {
                let shiftTypestr = type._id.toString();
                return shiftTypestr === shiftData.shiftType.toString();
            });
            if (shiftType) {
                let assignedUsers = shiftData.assignedUsers || [];
                let objectifiedAssignedUsers = assignedUsers.map((userId) => {
                    return new mongoose_1.Types.ObjectId(userId);
                });
                const newShift = await Shift_1.default.create({
                    ...shiftData,
                    shiftType,
                    homeId,
                    isAccepted: objectifiedAssignedUsers.length > 0,
                    agentId: shiftData.agentId === "internal" ? undefined : shiftData.agentId,
                    assignedUsers: objectifiedAssignedUsers || [],
                });
                createdShifts.push(newShift);
            }
        }
        return createdShifts;
    };
    deleteShift = async (shiftId) => {
        const deletedShift = await Shift_1.default.findByIdAndDelete(shiftId);
        return deletedShift;
    };
    updateShift = async (shiftId, updatedShiftData, shiftType) => {
        const updatedShift = await Shift_1.default.findByIdAndUpdate(shiftId, {
            ...updatedShiftData,
            shiftType,
        }, { new: true }).exec();
        return updatedShift;
    };
    acceptShift = async (shiftId) => {
        const updatedShift = await Shift_1.default.findByIdAndUpdate(shiftId, {
            isAccepted: true,
            isRejected: false,
        }, { new: true }).exec();
        return updatedShift;
    };
    rejectShift = async (shiftId) => {
        const updatedShift = await Shift_1.default.findByIdAndUpdate(shiftId, {
            isRejected: true,
            agentId: undefined,
            isAccepted: false,
        }, { new: true }).exec();
        return updatedShift;
    };
    assignUsers = async (shiftId, userIds) => {
        try {
            const shift = await Shift_1.default.findById(shiftId).exec();
            const existingUserIds = shift.assignedUsers.map((userId) => userId.toString());
            const isDuplicateUser = userIds.some((userId) => existingUserIds.includes(userId));
            if (isDuplicateUser) {
                throw new Error("User is already assigned to this shift");
            }
            if (!shift) {
                throw new Error("Shift not found");
            }
            if (userIds.length > shift.count) {
                throw new Error("Number of users exceeds the shift count");
            }
            shift.assignedUsers = userIds.map((userId) => new mongoose_1.Types.ObjectId(userId));
            await shift.save();
            return shift;
        }
        catch (error) {
            return Promise.reject(error);
        }
    };
    async assignCarersToShift(shiftId, validCarerIds) {
        try {
            const shift = await Shift_1.default.findById(shiftId);
            if (shift.isCompleted) {
                throw new ErrorHelper_1.default("Shift is already completed", statusCodes_1.default.BAD_REQUEST);
            }
            if (!shift) {
                throw new ErrorHelper_1.default("Shift not found", statusCodes_1.default.NOT_FOUND);
            }
            const updateFields = {
                isAccepted: true,
            };
            const existingAssignedUsers = shift.assignedUsers || [];
            const combinedAssignedUsers = [
                ...existingAssignedUsers,
                ...validCarerIds,
            ];
            const uniqueAssignedUsers = Array.from(new Set(combinedAssignedUsers.map(String))).map((ObjectId) => new mongoose_1.Types.ObjectId(ObjectId));
            updateFields.assignedUsers = uniqueAssignedUsers;
            if (updateFields.assignedUsers.length === shift.count) {
                updateFields.isCompleted = true;
            }
            const updatedShift = await Shift_1.default.findByIdAndUpdate(shiftId, { $set: updateFields }, { new: true }).populate({
                path: "assignedUsers",
                select: "_id fname lname",
            });
            return updatedShift;
        }
        catch (error) {
            console.error("Er", error);
            if (error instanceof ErrorHelper_1.default) {
                throw error.message;
            }
            throw error;
        }
    }
    async unassignCarerFromShift(shiftId, carerId) {
        try {
            const shift = await Shift_1.default.findById(shiftId);
            if (!shift) {
                throw new Error("Shift not found");
            }
            const updatedAssignedUsers = shift.assignedUsers.filter((userId) => !userId.equals(carerId));
            const updatedShift = await Shift_1.default.findByIdAndUpdate(shiftId, {
                $set: {
                    assignedUsers: updatedAssignedUsers,
                    isCompleted: updatedAssignedUsers.length === shift.count,
                },
            }, { new: true }).populate({
                path: "assignedUsers",
                select: "_id fname lname",
            });
            return updatedShift;
        }
        catch (error) {
            throw error;
        }
    }
    async generateQRCode(shiftId) {
        const shift = await Shift_1.default.findById(shiftId);
        if (!shift) {
            throw new Error("Shift not found");
        }
        const key = new node_rsa_1.default({ b: 512 });
        const privateKey = key.exportKey("pkcs1-private-pem");
        const publicKey = key.exportKey("pkcs1-public-pem");
        shift.privateKey = privateKey;
        await shift.save();
        const qrCodeData = await qrcode_1.default.toDataURL(publicKey);
        return { publicKey, qrCodeData };
    }
    async verifyPublicKey(shiftId, publicKey, carerId) {
        const shift = await Shift_1.default.findById(shiftId);
        if (!shift) {
            throw new Error("Shift not found");
        }
        const key = new node_rsa_1.default(shift.privateKey);
        const isValid = key.verify(carerId, publicKey, "utf8", "pkcs1-public-pem");
        if (isValid) {
            shift.signedCarers[carerId] = publicKey;
            await shift.save();
        }
        return isValid;
    }
}
exports.default = ShiftService;
//# sourceMappingURL=ShiftService.js.map