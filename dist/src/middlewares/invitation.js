"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const invitation_1 = __importDefault(require("src/validators/invitation"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("src/logger"));
const InvTokenHelper_1 = __importDefault(require("src/helpers/InvTokenHelper"));
const ApiError_1 = __importDefault(require("src/exceptions/ApiError"));
const strings_1 = __importDefault(require("src/constants/strings"));
const statusCodes_1 = __importDefault(require("src/constants/statusCodes"));
class InvitationMidleWare {
    static async validateInvitation(req, res, next) {
        try {
            const invToken = req.params.invToken;
            if (!invToken) {
                return next(new ApiError_1.default(strings_1.default.TOKEN_NOT_FOUND, statusCodes_1.default.NOT_FOUND));
            }
            const { invitation, decoded } = await InvTokenHelper_1.default.verifyToken(invToken);
            if (!decoded) {
                return next(new ApiError_1.default(strings_1.default.TOKEN_NOT_VERIFIED, statusCodes_1.default.UNAUTHORIZED));
            }
            const isExpired = await decoded.isExpired();
            if (isExpired) {
                res.status(statusCodes_1.default.UNAUTHORIZED);
                return res.json({
                    success: false,
                    error: strings_1.default.TOKEN_EXPIRED,
                    isExpired: isExpired,
                });
            }
            if (!invitation) {
                return next(new ApiError_1.default(strings_1.default.USER_NOT_FOUND, statusCodes_1.default.NOT_FOUND));
            }
            next();
            const { receiverId } = req.body;
            const senderId = req.currentUser._id;
            const { error } = invitation_1.default.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            const payload = {
                senderId,
                receiverId,
            };
            logger_1.default.info("Invitation payload: ", payload);
            const options = {
                expiresIn: "1h",
            };
            const token = await jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, options);
            logger_1.default.info("Invitation token: ", token);
            req.invToken = token;
            next();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = InvitationMidleWare;
//# sourceMappingURL=invitation.js.map