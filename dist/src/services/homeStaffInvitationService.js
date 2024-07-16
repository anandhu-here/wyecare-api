"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = __importDefault(require("src/constants/statusCodes"));
const strings_1 = __importDefault(require("src/constants/strings"));
const ErrorHelper_1 = __importDefault(require("src/helpers/ErrorHelper"));
const logger_1 = __importDefault(require("src/logger"));
const homeStaffInvitation_1 = __importDefault(require("src/models/homeStaffInvitation"));
const User_1 = __importDefault(require("src/models/User"));
class HomeStaffInvitationService {
    getInvitations = async (userId) => {
        try {
            const invitations = await homeStaffInvitation_1.default.find({
                $or: [{ senderId: userId }, { receiverId: userId }],
            })
                .populate("senderId", "fname lname email company")
                .sort({ createdAt: -1 });
            return invitations;
        }
        catch (error) {
            logger_1.default.error("HomeStaffInvitationService: getInvitations", error);
            throw error;
        }
    };
    sendInvitation = async (senderId, receiverEmail, accountType, companyName, senderAccountType) => {
        try {
            const sender = await User_1.default.findById(senderId);
            if (!sender) {
                throw new ErrorHelper_1.default(strings_1.default.SENDER_NOT_FOUND, statusCodes_1.default.NOT_FOUND);
            }
            const invitation = new homeStaffInvitation_1.default({
                senderId,
                receiverId: receiverEmail,
                accountType,
                companyName,
                senderAccountType,
                status: "pending",
            });
            const token = await invitation.generateToken();
            await invitation.save();
            return invitation;
        }
        catch (error) {
            logger_1.default.error("HomeStaffInvitationService: sendInvitation", error);
            throw error;
        }
    };
    updateInvitationStatus = async (invitationId, status) => {
        try {
            const invitation = await homeStaffInvitation_1.default.findById(invitationId);
            if (!invitation) {
                throw new ErrorHelper_1.default(strings_1.default.INVITATION_NOT_FOUND, statusCodes_1.default.NOT_FOUND);
            }
            if (invitation.status !== "pending") {
                throw new ErrorHelper_1.default(strings_1.default.INVITATION_NO_LONGER_PENDING, statusCodes_1.default.BAD_REQUEST);
            }
            invitation.status = status;
            await invitation.save();
            return invitation;
        }
        catch (error) {
            logger_1.default.error("HomeStaffInvitationService: updateInvitationStatus", error);
            throw error;
        }
    };
    getInvitationByToken = async (token) => {
        try {
            const invitation = await homeStaffInvitation_1.default.findOne({ invToken: token });
            if (!invitation) {
                throw new ErrorHelper_1.default(strings_1.default.INVITATION_NOT_FOUND, statusCodes_1.default.NOT_FOUND);
            }
            return invitation;
        }
        catch (error) {
            logger_1.default.error("HomeStaffInvitationService: getInvitationByToken", error);
            throw error;
        }
    };
    deleteInvitation = async (invitationId, userId) => {
        try {
            const invitation = await homeStaffInvitation_1.default.findById(invitationId);
            if (!invitation) {
                throw new ErrorHelper_1.default(strings_1.default.INVITATION_NOT_FOUND, statusCodes_1.default.NOT_FOUND);
            }
            if (invitation.senderId.toString() !== userId) {
                throw new ErrorHelper_1.default("Unauthorized to delete invitation", statusCodes_1.default.UNAUTHORIZED);
            }
            await homeStaffInvitation_1.default.findByIdAndDelete(invitationId);
        }
        catch (error) {
            logger_1.default.error("HomeStaffInvitationService: deleteInvitation", error);
            throw error;
        }
    };
}
exports.default = HomeStaffInvitationService;
//# sourceMappingURL=homeStaffInvitationService.js.map