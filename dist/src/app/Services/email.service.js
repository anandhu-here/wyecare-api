"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("src/logger"));
const nodemailer = require("nodemailer");
class WyeMailer {
    transporter;
    constructor(email, password) {
        try {
            this.transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: email,
                    pass: password,
                },
            });
        }
        catch (error) {
            logger_1.default.error("WyeMailer: constructor", "errorInfo:" + JSON.stringify(error));
        }
    }
    getTransporter() {
        return this.transporter;
    }
    async sendMail(mailOptions) {
        logger_1.default.info("WyeMailer: sendMail", "mailOptions:" + JSON.stringify(mailOptions));
        return this.transporter.sendMail(mailOptions);
    }
}
exports.default = WyeMailer;
//# sourceMappingURL=email.service.js.map