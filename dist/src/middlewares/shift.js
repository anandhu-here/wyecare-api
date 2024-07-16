"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const statusCodes_1 = __importDefault(require("src/constants/statusCodes"));
const Shift_1 = __importDefault(require("src/models/Shift"));
const shift_1 = require("src/validators/shift");
class ShiftMiddleware {
    validateShiftRequest(schema) {
        return (req, res, next) => {
            const { error } = schema.validate(req.body);
            if (error) {
                const errorMessage = error.details
                    .map((detail) => detail.message)
                    .join(", ");
                return res.status(400).json({ error: errorMessage });
            }
            next();
        };
    }
    async validateAssignCarers(req, res, next) {
        try {
            const { error } = shift_1.assignCarersSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            const { carerIds, shiftId } = req.body;
            const agency = req.currentUser;
            const shift = await Shift_1.default.findById(shiftId);
            if (agency.accountType !== "agency") {
                return res
                    .status(403)
                    .json({ error: "Only agencies can assign carers to shifts" });
            }
            const linkedCarerIds = agency.linkedUsers
                .find((linkedUser) => linkedUser.accountType === "carer")
                ?.users.map((userId) => userId.toString());
            if (carerIds.length === 0) {
                return res.status(statusCodes_1.default.BAD_REQUEST).json({
                    message: "At least one carer ID is required to assign carers to a shift",
                });
            }
            else if (carerIds.length > shift.count) {
                return res.status(statusCodes_1.default.BAD_REQUEST).json({
                    message: "The number of carers assigned to a shift cannot exceed the shift count",
                });
            }
            const validCarerIds = carerIds.filter((carerId) => linkedCarerIds?.includes(carerId));
            if (validCarerIds.length !== carerIds.length) {
                return res.status(400).json({
                    error: "Some of the provided carer IDs are not linked to the agency",
                });
            }
            req.body.validCarerIds = validCarerIds.map((carerId) => new mongoose_1.Types.ObjectId(carerId));
            next();
        }
        catch (error) {
            console.error("Error in validateAssignCarers middleware:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    async validateUnassignCarer(req, res, next) {
        try {
            const { shiftId } = req.params;
            const { carerId } = req.body;
            const agency = req.currentUser;
            const shift = await Shift_1.default.findById(shiftId);
            if (agency.accountType !== "agency") {
                return res
                    .status(403)
                    .json({ error: "Only agencies can unassign carers from shifts" });
            }
            if (!shift.assignedUsers.includes(new mongoose_1.Types.ObjectId(carerId))) {
                return res.status(400).json({
                    error: "The specified carer is not assigned to this shift",
                });
            }
            req.body.carerId = new mongoose_1.Types.ObjectId(carerId);
            next();
        }
        catch (error) {
            console.error("Error in validateUnassignCarer middleware:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
exports.default = new ShiftMiddleware();
//# sourceMappingURL=shift.js.map