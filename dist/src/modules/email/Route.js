"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = __importDefault(require("src/middlewares/Auth"));
const EmailController_1 = __importDefault(require("./EmailController"));
const email_1 = __importDefault(require("src/middlewares/email"));
const EmailRouter = (0, express_1.Router)();
const _emailController = new EmailController_1.default();
EmailRouter.route("/send-email").post(Auth_1.default.isAuthenticatedUser, email_1.default.validateSendEmail, _emailController.sendEmail);
exports.default = EmailRouter;
//# sourceMappingURL=Route.js.map