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
const toHomeStaffs_1 = require("../email/templates/toHomeStaffs");
class HomeStaffInvitation {
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
            const invitations = await this._invitationSvc.getInvitations(userId);
            res.status(statusCodes_1.default.OK);
            return res.json({
                success: true,
                message: strings_1.default.INVITATIONS_FETCHED_SUCCESS,
                data: invitations,
            });
        }
        catch (error) {
            logger_1.default.error("HomeStaffInvitationController: getInvitations", error);
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
            const { receiverEmail, accountType, companyName } = req.body;
            if (!receiverEmail || !accountType || !companyName) {
                return next(new ApiError_1.default('Missing required fields: "receiverEmail", "accountType", "companyName"', statusCodes_1.default.BAD_REQUEST));
            }
            const invitation = await this._invitationSvc.sendInvitation(senderId, receiverEmail, accountType, companyName, req.currentUser.accountType);
            const template = (0, toHomeStaffs_1.getHomeStaffInvitationTemplate)(`http://localhost:3000?token=${invitation.invToken}&company=${companyName}`, companyName);
            await this._emailSvc.sendEmail({
                from: "noreply@example.com",
                to: receiverEmail,
                subject: "Home Staff Invitation",
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
            logger_1.default.error("HomeStaffInvitationController: sendInvitation", error);
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: error.message || strings_1.default.SOMETHING_WENT_WRONG,
            });
        }
    };
    updateInvitationStatus = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.PUT) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const { invitationId } = req.params;
            const { status } = req.body;
            if (!invitationId || !status) {
                return next(new ApiError_1.default('Missing required fields: "invitationId", "status"', statusCodes_1.default.BAD_REQUEST));
            }
            const invitation = await this._invitationSvc.updateInvitationStatus(invitationId, status);
            res.status(statusCodes_1.default.OK);
            return res.json({
                success: true,
                message: "Invitation status updated successfully",
                data: invitation,
            });
        }
        catch (error) {
            logger_1.default.error("HomeStaffInvitationController: updateInvitationStatus", error);
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: error instanceof ErrorHelper_1.default
                    ? error.message
                    : strings_1.default.SOMETHING_WENT_WRONG,
            });
        }
    };
    getInvitationByToken = async (req, res, next) => {
        if (req.method !== enums_1.EHttpMethod.GET) {
            return next(new ApiError_1.default(strings_1.default.INVALID_REQUEST_METHOD, statusCodes_1.default.NOT_FOUND));
        }
        try {
            const { token } = req.params;
            if (!token) {
                return next(new ApiError_1.default(strings_1.default.TOKEN_NOT_FOUND, statusCodes_1.default.BAD_REQUEST));
            }
            const invitation = await this._invitationSvc.getInvitationByToken(token);
            if (!invitation) {
                return next(new ApiError_1.default(strings_1.default.INVITATION_NOT_FOUND, statusCodes_1.default.NOT_FOUND));
            }
            res.status(statusCodes_1.default.OK);
            return res.json({
                success: true,
                message: "Invitation fetched successfully",
                data: invitation,
            });
        }
        catch (error) {
            logger_1.default.error("HomeStaffInvitationController: getInvitationByToken", error);
            res.status(statusCodes_1.default.BAD_REQUEST);
            return res.json({
                success: false,
                error: error.message || strings_1.default.SOMETHING_WENT_WRONG,
            });
        }
    };
}
exports.default = HomeStaffInvitation;
//# sourceMappingURL=homeStaffInvitationController.js.map