"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TimesheetSchema = new mongoose_1.Schema({
    shiftId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Shift",
        required: true,
    },
    carerId: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    homeId: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
    },
    review: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});
TimesheetSchema.virtual("shift", {
    ref: "Shift",
    localField: "shiftId",
    foreignField: "_id",
    justOne: true,
});
const TimesheetModel = (0, mongoose_1.model)("Timesheet", TimesheetSchema);
exports.default = TimesheetModel;
//# sourceMappingURL=Timesheet.js.map