"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const emailValidator = joi_1.default.object({
    to: joi_1.default.string().email().required(),
    subject: joi_1.default.string().required(),
    text: joi_1.default.string().required(),
});
exports.default = emailValidator;
//# sourceMappingURL=email.js.map