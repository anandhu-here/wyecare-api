"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_service_1 = __importDefault(require("src/app/Services/email.service"));
class EmailServices {
    transporter;
    email;
    password;
    constructor() {
        this.email = process.env.EMAIL_USER;
        this.password = process.env.EMAIL_PASS;
        this.transporter = new email_service_1.default(this.email, this.password).getTransporter();
    }
    sendEmail = async (emailOptions) => {
        try {
            const mailOptions = {
                from: emailOptions.from,
                to: emailOptions.to,
                subject: emailOptions.subject,
                text: emailOptions.text,
                html: emailOptions.html,
            };
            await this.transporter.sendMail(mailOptions);
            return true;
        }
        catch (error) {
            throw new Error(`Failed to send email: ${error}`);
        }
    };
}
exports.default = EmailServices;
//# sourceMappingURL=EmailService.js.map