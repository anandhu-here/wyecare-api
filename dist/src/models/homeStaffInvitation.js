"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
const HomeStaffInvitationSchema = new mongoose_1.Schema({
    senderId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    receiverId: { type: String, required: true },
    accountType: {
        type: String,
        enum: ["carer", "senior carer", "nurse", "guest"],
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        required: true,
        default: "pending",
    },
    companyName: { type: String, required: true },
    invToken: String,
    senderAccountType: String,
}, { timestamps: true });
HomeStaffInvitationSchema.methods.generateToken =
    async function () {
        const token = crypto_1.default.randomBytes(20).toString("hex");
        this.invToken = token;
        await this.save();
        return token;
    };
const HomeStaffInvitation = (0, mongoose_1.model)("HomeStaffInvitation", HomeStaffInvitationSchema);
exports.default = HomeStaffInvitation;
//# sourceMappingURL=homeStaffInvitation.js.map