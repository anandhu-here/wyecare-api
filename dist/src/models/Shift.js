"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftSchema = void 0;
const mongoose_1 = require("mongoose");
const ShiftType_1 = require("./ShiftType");
exports.ShiftSchema = new mongoose_1.Schema({
    agentId: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: false,
        default: undefined,
    },
    homeId: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isAccepted: {
        type: Boolean,
        default: false,
    },
    isRejected: {
        type: Boolean,
        default: false,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    count: {
        type: Number,
        default: 0,
    },
    date: {
        type: String,
    },
    assignedUsers: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    privateKey: { type: String, required: false },
    signedCarers: { type: Object, default: {} },
    shiftType: {
        type: ShiftType_1.ShiftTypeSchema,
        required: true,
    },
}, {
    timestamps: true,
});
const ShiftModel = (0, mongoose_1.model)("Shift", exports.ShiftSchema);
exports.default = ShiftModel;
//# sourceMappingURL=Shift.js.map