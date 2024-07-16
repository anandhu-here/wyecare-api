"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = __importDefault(require("../../constants/statusCodes"));
const strings_1 = __importDefault(require("../../constants/strings"));
const ApiError_1 = __importDefault(require("../../exceptions/ApiError"));
const MailServiceHelper_1 = __importDefault(require("../../helpers/MailServiceHelper"));
const MailTemplateHelper_1 = __importDefault(require("../../helpers/MailTemplateHelper"));
const OtpServiceHelper_1 = __importDefault(require("../../helpers/OtpServiceHelper"));
const logger_1 = __importDefault(require("../../logger"));
const User_1 = __importDefault(require("../../models/User"));
const validator_1 = __importDefault(require("../../utils/validator"));
const enums_1 = require("../../enums");
const LocalConfig_1 = __importDefault(require("src/configs/LocalConfig"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthToken_1 = __importDefault(require("src/models/AuthToken"));
class LoginController {
    userSvc;
    _userSvc;
    constructor(userSvc) {
        this.userSvc = userSvc;
        this._userSvc = userSvc;
    }
    sendLoginOtp = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.POST) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const { email } = req.body;
            if (!email) {
                return next(new ApiError_1.default(strings_1.default.EMAIL_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (!validator_1.default.validateEmail(email)) {
                return next(new ApiError_1.default(strings_1.default.INVALID_EMAIL_FORMAT, statusCodes_1.default.BAD_REQUEST));
            }
            const _email = email?.toLowerCase().trim();
            const user = await User_1.default.findOne({ email: _email });
            if (!user) {
                return next(new ApiError_1.default(strings_1.default.EMAIL_NOT_REGISTERED, statusCodes_1.default.BAD_REQUEST));
            }
            const newOtp = await OtpServiceHelper_1.default.generateOtpFromEmail(user.email);
            if (!newOtp) {
                return next(new ApiError_1.default(strings_1.default.OTP_CREATE_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            const htmlMessage = await MailTemplateHelper_1.default.getOtpEmail(newOtp.otp, `${user.fname} ${user.lname}`);
            if (htmlMessage) {
                await MailServiceHelper_1.default.sendEmail({
                    to: user.email,
                    subject: "OTP For Login",
                    htmlContent: htmlMessage,
                });
            }
            res.status(statusCodes_1.default.OK);
            return res.json({
                success: true,
                message: strings_1.default.SUCCESS,
                otp: newOtp.otp,
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.error(errorMessage);
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
    checkUser = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.GET) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        logger_1.default.info("Check User Start");
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader.split(" ")[1];
            if (!token) {
                return next(new ApiError_1.default(strings_1.default.BEARER_TOKEN_REQUIRED, statusCodes_1.default.UNAUTHORIZED));
            }
            logger_1.default.info("Validation Start");
            logger_1.default.info("Check Email Exists Start");
            const jwtSecret = LocalConfig_1.default.getConfig().JWT_SECRET;
            if (!jwtSecret)
                throw new Error(strings_1.default.JWT_SECRET_NOT_FOUND);
            const decodedData = jsonwebtoken_1.default.verify(token, jwtSecret);
            if (!decodedData || typeof decodedData === "string") {
                logger_1.default.error(`JwtError :: An error occurred while verifying JwtToken`);
                throw new Error(strings_1.default.JWT_TOKEN_INVALID);
            }
            const authToken = await AuthToken_1.default.findOne({
                token: token,
                userId: decodedData.id,
            });
            if (!authToken) {
                logger_1.default.error(`AuthToken :: Token not found`);
                throw new Error(strings_1.default.JWT_TOKEN_INVALID);
            }
            console.log(authToken, "authooo");
            const user = await User_1.default.findById(decodedData.id);
            if (!user) {
                logger_1.default.error(`User :: User not found`);
                throw new Error(strings_1.default.USER_NOT_FOUND);
            }
            logger_1.default.info(`AuthToken :: Token verified`);
            logger_1.default.info("Check User End");
            res.status(statusCodes_1.default.OK);
            const resData = {
                token: authToken.token,
                expiresAt: authToken.expiresAt,
            };
            return res.json({
                success: true,
                message: strings_1.default.SUCCESS,
                data: resData,
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.error("LoginController: checkUser", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
    login = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.POST) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        logger_1.default.info("Login Start");
        try {
            const { email, password } = req.body;
            logger_1.default.info("Validation Start");
            if (!email) {
                return next(new ApiError_1.default(strings_1.default.EMAIL_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (!validator_1.default.validateEmail(email)) {
                return next(new ApiError_1.default(strings_1.default.INVALID_EMAIL_FORMAT, statusCodes_1.default.BAD_REQUEST));
            }
            if (!password) {
                return next(new ApiError_1.default(strings_1.default.PASSWORD_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (password.length < 8) {
                return next(new ApiError_1.default(strings_1.default.PASSWORD_MIN_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (password.length > 32) {
                return next(new ApiError_1.default(strings_1.default.PASSWORD_MAX_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            logger_1.default.info("Validation End");
            const _email = email?.toLowerCase().trim();
            const _password = password?.trim();
            logger_1.default.info("Check Email Exists Start");
            const isEmailExists = await this._userSvc.checkIsEmailExistsExc(_email);
            logger_1.default.info("Check Email Exists End");
            if (!isEmailExists) {
                return next(new ApiError_1.default(strings_1.default.EMAIL_NOT_REGISTERED, statusCodes_1.default.BAD_REQUEST));
            }
            logger_1.default.info("Find User Start");
            const user = await this._userSvc.findUserByEmailExc(_email);
            logger_1.default.info("Find User End");
            logger_1.default.info("Match Password Start");
            const isPasswordMatched = await user.matchPassword(_password);
            logger_1.default.info("Match Password End");
            if (!isPasswordMatched) {
                return next(new ApiError_1.default(strings_1.default.INCORRECT_PASSWORD, statusCodes_1.default.BAD_REQUEST));
            }
            logger_1.default.info("Get Token Start");
            const authToken = await user.getToken();
            logger_1.default.info("Get Token End");
            const resData = {
                token: authToken.token,
                expiresAt: authToken.expiresAt,
                user: user,
            };
            logger_1.default.info("Login End");
            res.status(statusCodes_1.default.OK);
            return res.json({
                success: true,
                message: strings_1.default.SUCCESS,
                data: resData,
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.error("LoginController: login", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
}
exports.default = LoginController;
//# sourceMappingURL=LoginController.js.map