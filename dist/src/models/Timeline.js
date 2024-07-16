"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TimelineItemSchema = new mongoose_1.Schema({
    dateStarted: {
        type: Date,
        required: true,
    },
    dateEnded: {
        type: Date,
        required: true,
    },
    agencyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});
const TimelineSchema = new mongoose_1.Schema({
    carerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    currentAgency: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    timeline: {
        type: [TimelineItemSchema],
        default: [],
    },
}, {
    timestamps: true,
});
const TimelineModel = (0, mongoose_1.model)("Timeline", TimelineSchema);
exports.default = TimelineModel;
//# sourceMappingURL=Timeline.js.map