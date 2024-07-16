"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = __importDefault(require("src/constants/statusCodes"));
const strings_1 = __importDefault(require("src/constants/strings"));
const enums_1 = require("src/enums");
const ApiError_1 = __importDefault(require("src/exceptions/ApiError"));
const ErrorHelper_1 = __importDefault(require("src/helpers/ErrorHelper"));
const logger_1 = __importDefault(require("src/logger"));
const EmailService_1 = __importDefault(require("src/services/EmailService"));
const toHome_1 = require("../email/templates/toHome");
const toCarer_1 = require("../email/templates/toCarer");
const InvTokenHelper_1 = __importDefault(require("src/helpers/InvTokenHelper"));
class Invitation {
    invitationSvc;
    userSvc;
    _invitationSvc;
    _userSvc;
    _emailSvc;
    constructor(invitationSvc, userSvc) {
        this.invitationSvc = invitationSvc;
        this.userSvc = userSvc;
        this._invitationSvc = invitationSvc;
        this._userSvc = userSvc;
        this._emailSvc = new EmailService_1.default();
    }
    getInvitations = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.GET) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const userId = req.currentUser._id;
            const invitations = await this._invitationSvc.getInvitationsExc(userId);
            res.status(statusCodes_1.default.OK);
            return res.json({
                success: true,
                message: strings_1.default.INVITATIONS_FETCHED_SUCCESS,
                data: invitations,
            });
        }
        catch (error) {
            logger_1.default.error("InvitationController: getInvitations", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: error.message || strings_1.default.SOMETHING_WENT_WRONG,
            });
        }
    };
    cancelInvitation = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.DELETE) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const userId = req.currentUser._id;
            const { invitationId } = req.params;
            if (!invitationId) {
                return next(new ApiError_1.default(strings_1.default.INVITATION_ID_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            await this._invitationSvc.cancelInvitationExc(invitationId, userId);
            res.status(statusCodes_1.default.OK);
            return res.json({
                success: true,
                message: strings_1.default.INVITATION_CANCELLED_SUCCESS,
            });
        }
        catch (error) {
            logger_1.default.error("InvitationController: cancelInvitation", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: error.message || strings_1.default.SOMETHING_WENT_WRONG,
            });
        }
    };
    sendInvitation = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.POST) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const senderId = req.currentUser._id;
            const { receiverId } = req.body;
            if (!receiverId) {
                return next(new ApiError_1.default(strings_1.default.RECEIVER_ID_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            const invitation = await this._invitationSvc.sendInvitationExc(senderId, receiverId, req.currentUser.accountType);
            const token = invitation.invToken;
            const receiver = await this._userSvc.findUserByIdExc(receiverId);
            let template = (0, toHome_1.getHomeTemplate)(`http://localhost:3000?token=${token}&company=${req.currentUser?.company.name}`);
            if (receiver.accountType === "carer") {
                template = (0, toCarer_1.getCarerTemplate)(`http://localhost:3000?token=${token}&company=${req.currentUser?.company.name}`);
            }
            if (receiver.accountType === "carer") {
                template = (0, toCarer_1.getCarerTemplate)(`http://localhost:3000?token=${token}&company=${req.currentUser?.company.name}`);
            }
            await this._emailSvc.sendEmail({
                from: "annusathee@gmail.com",
                to: receiver.email,
                subject: "Join Invitation",
                html: template,
            });
            res.status(statusCodes_1.default.CREATED);
            return res.json({
                success: true,
                message: strings_1.default.INVITATION_SENT_SUCCESS,
                data: invitation,
            });
        }
        catch (error) {
            logger_1.default.error("InvitationController: sendInvitation", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: error.message || strings_1.default.SOMETHING_WENT_WRONG,
            });
        }
    };
    acceptInvitation = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.PUT) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const userId = req.currentUser._id;
            const { invitationId } = req.params;
            if (!invitationId) {
                return next(new ApiError_1.default(strings_1.default.INVITATION_ID_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            const invitation = await this._invitationSvc.acceptInvitationExc(invitationId, userId);
            res.status(statusCodes_1.default.OK);
            return res.json({
                success: true,
                message: strings_1.default.INVITATION_ACCEPTED_SUCCESS,
                data: invitation,
            });
        }
        catch (error) {
            console.log(error, "error");
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: error instanceof ErrorHelper_1.default
                    ? error.message
                    : error || strings_1.default.SOMETHING_WENT_WRONG,
            });
        }
    };
    rejectInvitation = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.PUT) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const userId = req.currentUser._id;
            const { invitationId } = req.params;
            if (!invitationId) {
                return next(new ApiError_1.default(strings_1.default.INVITATION_ID_REQUIRED, statusCodes_1.default.BAD_REQUEST));
            }
            const invitation = await this._invitationSvc.rejectInvitationExc(invitationId, userId);
            res.status(statusCodes_1.default.OK);
            return res.json({
                success: true,
                message: strings_1.default.INVITATION_REJECTED_SUCCESS,
                data: invitation,
            });
        }
        catch (error) {
            logger_1.default.error("InvitationController: rejectInvitation", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: error.message || strings_1.default.SOMETHING_WENT_WRONG,
            });
        }
    };
    getInvitation = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.GET) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const token = req.params.invToken;
            if (!token) {
                return next(new ApiError_1.default(strings_1.default.TOKEN_NOT_FOUND, statusCodes_1.default.BAD_REQUEST));
            }
            if (token === "null") {
                return next(new ApiError_1.default(strings_1.default.TOKEN_NOT_FOUND, statusCodes_1.default.BAD_REQUEST));
            }
            const { invitation: invitationObj, decoded } = await InvTokenHelper_1.default.verifyToken(token);
            if (!invitationObj) {
                return next(new ApiError_1.default(strings_1.default.INVITATION_NOT_FOUND, statusCodes_1.default.NOT_FOUND));
            }
            if (invitationObj.receiverId.toString() !== req.currentUser._id.toString()) {
                return next(new ApiError_1.default(strings_1.default.UNAUTHORIZED, statusCodes_1.default.UNAUTHORIZED));
            }
            res.status(statusCodes_1.default.OK);
            return res.json({
                success: true,
                message: "Invitation fetch success",
                data: invitationObj,
            });
        }
        catch (error) {
            logger_1.default.error("InvitationController: getInvitation", "errorInfo:" + JSON.stringify(error));
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: error.message || strings_1.default.SOMETHING_WENT_WRONG,
            });
        }
    };
}
exports.default = Invitation;
//# sourceMappingURL=invitationController.js.map