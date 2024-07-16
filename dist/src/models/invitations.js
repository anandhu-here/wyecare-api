"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("src/logger"));
const JoinInvitationSchema = new mongoose_1.Schema({
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    senderAccountType: { type: String, required: true },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    invToken: { type: String },
    companyName: { type: String, required: true },
}, { timestamps: true });
JoinInvitationSchema.pre("save", function (next) {
    if (!this.invToken) {
        this.generateToken();
    }
    next();
});
JoinInvitationSchema.methods.generateToken = function () {
    const payload = {
        senderId: this.senderId,
        receiverId: this.receiverId,
    };
    const options = {
        expiresIn: "1h",
    };
    this.invToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, options);
    logger_1.default.warn("token: ", this.invToken);
    return this.invToken;
};
exports.default = mongoose_1.default.model("JoinInvitation", JoinInvitationSchema);
//# sourceMappingURL=invitations.js.map