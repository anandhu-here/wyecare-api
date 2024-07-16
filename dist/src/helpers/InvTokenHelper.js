"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const LocalConfig_1 = __importDefault(require("../configs/LocalConfig"));
const logger_1 = __importDefault(require("../logger"));
const strings_1 = __importDefault(require("../constants/strings"));
const invitations_1 = __importDefault(require("src/models/invitations"));
class TokenServiceHelper {
    static async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, LocalConfig_1.default.getConfig().JWT_SECRET);
            if (!decoded || typeof decoded === "string") {
                throw new Error(strings_1.default.TOKEN_NOT_VERIFIED);
            }
            const invitation = await invitations_1.default.findOne({
                invToken: token,
            });
            if (!invitation) {
                logger_1.default.error(strings_1.default.TOKEN_NOT_FOUND);
                return null;
            }
            return {
                invitation,
                decoded,
            };
        }
        catch (error) {
            logger_1.default.error(error.message);
            return null;
        }
    }
    static async isTokenExpired(expiresAt) {
        if (expiresAt < new Date().getTime() / 1000) {
            return true;
        }
        return false;
    }
}
exports.default = TokenServiceHelper;
//# sourceMappingURL=InvTokenHelper.js.map