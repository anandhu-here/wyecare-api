"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const invitationValidagtor = joi_1.default.object({
    senderId: joi_1.default.string(),
    receiverId: joi_1.default.string(),
    status: joi_1.default.string().valid("pending", "accepted", "rejected"),
    companyName: joi_1.default.string(),
});
exports.default = invitationValidagtor;
//# sourceMappingURL=invitation.js.map