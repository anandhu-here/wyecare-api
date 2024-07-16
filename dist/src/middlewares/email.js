"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = __importDefault(require("src/validators/email"));
class EmailMiddleware {
    static async validateSendEmail(req, res, next) {
        try {
            const { error } = email_1.default.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = EmailMiddleware;
//# sourceMappingURL=email.js.map