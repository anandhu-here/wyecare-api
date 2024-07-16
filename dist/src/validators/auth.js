"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const http_status_codes_1 = require("http-status-codes");
const removeLinkedUserValidator = async (req, res, next) => {
    const schema = joi_1.default.object({
        linkedUserType: joi_1.default.string().required(),
        linkedUserId: joi_1.default.string().required(),
    });
    try {
        await schema.validateAsync(req.body);
        const { linkedUserId } = req.body;
        const currentUser = req.currentUser;
        const linkedUserIndex = currentUser.linkedUsers.findIndex((linkedUser) => linkedUser.users.some((userId) => userId.toString() === linkedUserId));
        if (linkedUserIndex === -1) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "You are not authorized to remove this linked user",
            });
        }
        next();
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Invalid request data",
        });
    }
};
exports.default = removeLinkedUserValidator;
//# sourceMappingURL=auth.js.map