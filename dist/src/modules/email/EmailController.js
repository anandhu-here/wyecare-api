"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = __importDefault(require("src/constants/statusCodes"));
const strings_1 = __importDefault(require("src/constants/strings"));
const ErrorHelper_1 = __importDefault(require("src/helpers/ErrorHelper"));
const EmailService_1 = __importDefault(require("src/services/EmailService"));
const toHome_1 = require("./templates/toHome");
const UserService_1 = __importDefault(require("src/services/UserService"));
const toCarer_1 = require("./templates/toCarer");
const nodemailer = require("nodemailer");
class EmailController {
    emailService;
    transporter;
    userSvc;
    constructor() {
        this.emailService = new EmailService_1.default();
        console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS, "email, pass");
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        this.userSvc = new UserService_1.default();
    }
    sendEmail = async (req, res) => {
        try {
            const { to, subject, text } = req.body;
            const user = req.currentUser;
            const toUser = await this.userSvc.findUserByEmailExc(to);
            if (!user) {
                return res
                    .status(statusCodes_1.default.UNAUTHORIZED)
                    .json({ message: strings_1.default.UNAUTHORIZED });
            }
            let template = (0, toHome_1.getHomeTemplate)(`http://localhost:3000/accept-invitations?from=${user.email}`);
            if (toUser.accountType === "carer") {
                template = (0, toCarer_1.getCarerTemplate)(`http://localhost:3000/accept-invitations?from=${user.email}`);
            }
            return res
                .status(statusCodes_1.default.OK)
                .json({ message: "Email sent successfully" });
        }
        catch (error) {
            console.log(error, "error email");
            return res.status(500).json({
                message: error instanceof ErrorHelper_1.default
                    ? error.message
                    : strings_1.default.SOMETHING_WENT_WRONG,
            });
        }
    };
}
exports.default = EmailController;
//# sourceMappingURL=EmailController.js.map