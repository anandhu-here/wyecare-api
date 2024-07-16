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
const validator_1 = __importDefault(require("../../utils/validator"));
const enums_1 = require("../../enums");
const TimelineService_1 = __importDefault(require("src/services/TimelineService"));
class RegisterController {
    userSvc;
    profileSvc;
    shiftSvc;
    _userSvc;
    _profileSvc;
    _timeliineSvc;
    constructor(userSvc, profileSvc, shiftSvc) {
        this.userSvc = userSvc;
        this.profileSvc = profileSvc;
        this.shiftSvc = shiftSvc;
        this._userSvc = userSvc;
        this._profileSvc = profileSvc;
        this._timeliineSvc = new TimelineService_1.default();
    }
    sendRegisterOtp = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.POST) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const { fname, lname, email, password, confirmPassword, } = req.body;
            if (!fname) {
                return next(new ApiError_1.default(strings_1.default.FIRST_NAME_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (!lname) {
                return next(new ApiError_1.default(strings_1.default.LAST_NAME_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
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
            if (!confirmPassword) {
                return next(new ApiError_1.default(strings_1.default.CONFIRM_PASSWORD_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (confirmPassword.length < 8) {
                return next(new ApiError_1.default(strings_1.default.CONFIRM_PASSWORD_MIN_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (confirmPassword.length > 32) {
                return next(new ApiError_1.default(strings_1.default.CONFIRM_PASSWORD_MAX_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (password.trim() !== confirmPassword.trim()) {
                return next(new ApiError_1.default(strings_1.default.PASSWORDS_DO_NOT_MATCH, statusCodes_1.default.BAD_REQUEST));
            }
            const _fname = fname?.trim();
            const _lname = lname?.trim();
            const _email = email?.toLowerCase().trim();
            const isEmailExists = await this._userSvc.checkIsEmailExistsExc(_email);
            if (isEmailExists) {
                res.status(statusCodes_1.default.BAD_REQUEST);
                return res.json({
                    success: false,
                    message: strings_1.default.EMAIL_ALREADY_REGISTERED,
                    isEmailUsed: true,
                });
            }
            const newOtp = await OtpServiceHelper_1.default.generateOtpFromEmail(_email);
            if (!newOtp) {
                return next(new ApiError_1.default(strings_1.default.OTP_CREATE_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            const htmlMessage = await MailTemplateHelper_1.default.getOtpEmail(newOtp.otp, `${_fname} ${_lname}`);
            if (htmlMessage) {
                await MailServiceHelper_1.default.sendEmail({
                    to: _email,
                    subject: "OTP For Registration",
                    htmlContent: htmlMessage,
                });
            }
            res.status(statusCodes_1.default.OK);
            return res.json({
                success: true,
                message: strings_1.default.SUCCESS,
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.error("RegisterController: sendRegisterOtp", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
    register = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.POST) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        console.log("RegisterController: register", req.body);
        try {
            const { fname, lname, email, password, confirmPassword, accountType, company, availabilities, ...additionalData } = req.body;
            const { linkedUserId, linkedUserType } = additionalData;
            if (!fname) {
                return next(new ApiError_1.default(strings_1.default.FIRST_NAME_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (!lname) {
                return next(new ApiError_1.default(strings_1.default.LAST_NAME_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
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
            if (!confirmPassword) {
                return next(new ApiError_1.default(strings_1.default.CONFIRM_PASSWORD_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            if (confirmPassword.length < 8) {
                return next(new ApiError_1.default(strings_1.default.CONFIRM_PASSWORD_MIN_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (confirmPassword.length > 32) {
                return next(new ApiError_1.default(strings_1.default.CONFIRM_PASSWORD_MAX_LENGTH_ERROR, statusCodes_1.default.BAD_REQUEST));
            }
            if (password.trim() !== confirmPassword.trim()) {
                return next(new ApiError_1.default(strings_1.default.PASSWORDS_DO_NOT_MATCH, statusCodes_1.default.BAD_REQUEST));
            }
            const _fname = fname?.trim();
            const _lname = lname?.trim();
            const _email = email?.toLowerCase().trim();
            const isEmailExists = await this._userSvc.checkIsEmailExistsExc(_email);
            if (isEmailExists) {
                res.status(statusCodes_1.default.BAD_REQUEST);
                return res.json({
                    success: false,
                    message: strings_1.default.EMAIL_ALREADY_REGISTERED,
                    isEmailUsed: true,
                });
            }
            const _currentDateTime = new Date(Date.now());
            const newUserData = {
                fname: _fname,
                lname: _lname,
                nameChangedAt: _currentDateTime,
                email: _email,
                isEmailVerified: true,
                emailChangedAt: _currentDateTime,
                accountType: accountType,
                company: company,
                availabilities: availabilities,
            };
            if (linkedUserId && linkedUserType) {
                newUserData.linkedUsers = [
                    {
                        accountType: linkedUserType,
                        users: [linkedUserId],
                    },
                ];
            }
            console.log("newUserData", newUserData);
            const newUser = await this._userSvc.createUserExc(newUserData);
            if (linkedUserId && linkedUserType) {
                const existingUser = await this._userSvc.findUserByIdExc(linkedUserId);
                if (existingUser) {
                    if (!existingUser.linkedUsers) {
                        existingUser.linkedUsers = [];
                    }
                    const existingLinkedUserType = existingUser.linkedUsers.find((linkedUser) => linkedUser.accountType === newUserData.accountType);
                    console.log("existingLinkedUserType", existingLinkedUserType);
                    if (existingLinkedUserType) {
                        existingLinkedUserType.users.push(newUser._id);
                    }
                    else {
                        existingUser.linkedUsers.push({
                            accountType: newUser.accountType,
                            users: [newUser._id],
                        });
                    }
                    await this._userSvc.updateUser(existingUser._id, existingUser);
                }
            }
            await newUser.setPassword(password.trim());
            await this._profileSvc.getProfileExc(newUser);
            const authToken = await newUser.getToken();
            const resData = {
                token: authToken.token,
                expiresAt: authToken.expiresAt,
                user: newUser,
            };
            res.status(statusCodes_1.default.CREATED);
            return res.json({
                success: true,
                message: strings_1.default.SUCCESS,
                data: resData,
            });
        }
        catch (error) {
            console.log(error, "\rrrr");
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.error("RegisterController: register", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: errorMessage,
            });
        }
    };
    linkUser = async (req, res) => {
        try {
            const currentUser = req.currentUser;
            const { linkedUserId, linkedUserType } = req.body;
            if (!linkedUserId || !linkedUserType) {
                return res.status(statusCodes_1.default.BAD_REQUEST).json({
                    success: false,
                    message: "Linked user ID and type are required",
                });
            }
            const linkedUser = await this._userSvc.findUserByIdExc(linkedUserId);
            if (!linkedUser) {
                return res.status(statusCodes_1.default.NOT_FOUND).json({
                    success: false,
                    message: "Linked user not found",
                });
            }
            const updateLinkedUsers = (user, otherUserId, otherUserType) => {
                if (!user.linkedUsers) {
                    user.linkedUsers = [];
                }
                const existingLinkedUserType = user.linkedUsers.find((linkedUser) => linkedUser.accountType === otherUserType);
                if (existingLinkedUserType) {
                    const isAlreadyLinked = existingLinkedUserType.users.some((userId) => userId.toString() === otherUserId);
                    if (isAlreadyLinked) {
                        return false;
                    }
                    existingLinkedUserType.users.push(otherUserId);
                }
                else {
                    user.linkedUsers.push({
                        accountType: otherUserType,
                        users: [otherUserId],
                    });
                }
                return true;
            };
            const currentUserUpdated = updateLinkedUsers(currentUser, linkedUserId, linkedUserType);
            if (currentUser.accountType === "carer" && linkedUserType === "agency") {
                const response = await this._timeliineSvc.addAgencyToTimeline(currentUser._id, linkedUserId, new Date(), "");
                console.log("response", response);
            }
            if (!currentUserUpdated) {
                return res.status(statusCodes_1.default.BAD_REQUEST).json({
                    success: false,
                    message: "User is already linked",
                });
            }
            updateLinkedUsers(linkedUser, currentUser._id, currentUser.accountType);
            await Promise.all([
                this._userSvc.updateUser(currentUser._id, currentUser),
                this._userSvc.updateUser(linkedUser._id, linkedUser),
            ]);
            return res.status(statusCodes_1.default.OK).json({
                success: true,
                message: "Users linked successfully",
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.error("UserController: linkUser", "errorInfo:" + JSON.stringify(error));
            return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: errorMessage,
            });
        }
    };
    removeLinkedUser = async (req, res) => {
        try {
            const currentUser = req.currentUser;
            const { linkedUserType, linkedUserId } = req.body;
            if (!linkedUserType || !linkedUserId) {
                return res.status(statusCodes_1.default.BAD_REQUEST).json({
                    success: false,
                    message: "Linked user type and ID are required",
                });
            }
            if (currentUser.accountType === "agency" && linkedUserType === "carer") {
                const response = await this._timeliineSvc.removeCurrentAgency(linkedUserId);
            }
            const updatedUser = await this._userSvc.removeLinkedUser(currentUser._id, linkedUserType, linkedUserId);
            return res.status(statusCodes_1.default.OK).json({
                success: true,
                message: "Linked user removed successfully",
                data: updatedUser,
            });
        }
        catch (error) {
            const errorMessage = error?.message || error || strings_1.default.SOMETHING_WENT_WRONG;
            logger_1.default.error("UserController: removeLinkedUser", "errorInfo:" + JSON.stringify(error));
            return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: errorMessage,
            });
        }
    };
}
exports.default = RegisterController;
//# sourceMappingURL=RegisterController.js.map