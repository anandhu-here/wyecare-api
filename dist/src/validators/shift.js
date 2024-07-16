"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignCarersSchema = exports.createShiftSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const statusCodes_1 = __importDefault(require("src/constants/statusCodes"));
const Shift_1 = __importDefault(require("src/models/Shift"));
const objectIdValidator = (value, helpers) => {
    if (!mongoose_1.Types.ObjectId.isValid(value)) {
        return helpers.message({ custom: '"{{#label}}" must be a valid ObjectId' });
    }
    return value;
};
exports.createShiftSchema = joi_1.default.object({
    agentId: joi_1.default.string().custom(objectIdValidator).required(),
    homeId: joi_1.default.string().custom(objectIdValidator).optional(),
    isAccepted: joi_1.default.boolean().optional(),
    isCompleted: joi_1.default.boolean().optional(),
    shiftType: joi_1.default.string().custom(objectIdValidator).required(),
    createdAt: joi_1.default.date().optional(),
    updatedAt: joi_1.default.date().optional(),
    date: joi_1.default.string().required(),
});
exports.assignCarersSchema = joi_1.default.object({
    shiftId: joi_1.default.string().required(),
    carerIds: joi_1.default.array().items(joi_1.default.string()).required(),
});
const validateAgencyAccept = async (req, res, next) => {
    try {
        const shiftId = req.params.shiftId;
        if (!shiftId) {
            return res
                .status(statusCodes_1.default.BAD_REQUEST)
                .json({ message: "shiftId is required" });
        }
        const currentUser = req.currentUser;
        if (!currentUser) {
            return res
                .status(statusCodes_1.default.UNAUTHORIZED)
                .json({ message: "Authentication required" });
        }
        if (currentUser.accountType !== "agency") {
            return res
                .status(statusCodes_1.default.UNAUTHORIZED)
                .json({ message: "Only agency users can accept shifts" });
        }
        const shift = await Shift_1.default.findById(shiftId).exec();
        if (!shift) {
            return res
                .status(statusCodes_1.default.NOT_FOUND)
                .json({ message: "Shift not found" });
        }
        if (shift.isAccepted) {
            return res
                .status(statusCodes_1.default.BAD_REQUEST)
                .json({ message: "Shift is already accepted" });
        }
        if (shift.agentId.toString() !== currentUser._id.toString()) {
            return res
                .status(statusCodes_1.default.UNAUTHORIZED)
                .json({ message: "You are not authorized to accept this shift" });
        }
        next();
    }
    catch (error) {
        console.error("Error in validateAgencyUser middleware:", error);
        res
            .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
            .json({ message: "An error occurred" });
    }
};
exports.default = validateAgencyAccept;
//# sourceMappingURL=shift.js.map