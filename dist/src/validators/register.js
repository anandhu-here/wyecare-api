"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerValidator = joi_1.default.object({
    fname: joi_1.default.string().required().max(100),
    lname: joi_1.default.string().required().max(100),
    email: joi_1.default.string().email().required().max(100),
    password: joi_1.default.string().required().min(8).max(32),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref("password")).required(),
    linkedUserId: joi_1.default.string(),
    linkedUserType: joi_1.default.string(),
    company: joi_1.default.object({
        name: joi_1.default.string().max(100),
        address: joi_1.default.string().max(100),
        phone: joi_1.default.string().length(10),
        email: joi_1.default.string().email().max(100),
        website: joi_1.default.string().max(100),
        isPrivate: joi_1.default.boolean().default(false),
    }),
    accountType: joi_1.default.string()
        .valid("carer", "agency", "nurse", "home", "admin", "superadmin", "user", "guest", "unknown")
        .default("user"),
});
//# sourceMappingURL=register.js.map