"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftTypeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ShiftTypeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
});
const ShiftTypeModel = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: "User",
    },
    shifttypes: [exports.ShiftTypeSchema],
}, { timestamps: true });
const ShiftType = (0, mongoose_1.model)("ShiftType", ShiftTypeModel);
exports.default = ShiftType;
//# sourceMappingURL=ShiftType.js.map