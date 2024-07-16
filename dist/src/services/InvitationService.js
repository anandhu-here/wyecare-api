"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = __importDefault(require("src/constants/statusCodes"));
const strings_1 = __importDefault(require("src/constants/strings"));
const ErrorHelper_1 = __importDefault(require("src/helpers/ErrorHelper"));
const logger_1 = __importDefault(require("src/logger"));
const User_1 = __importDefault(require("src/models/User"));
const invitations_1 = __importDefault(require("src/models/invitations"));
class InvitationService {
    getInvitationsExc = async (userId) => {
        try {
            const invitations = await invitations_1.default.find({
                $and: [
                    { $or: [{ senderId: userId }, { receiverId: userId }] },
                    { status: "pending" },
                ],
            })
                .populate("senderId", "fname lname email companyName")
                .populate("receiverId", "fname lname email companyName")
                .sort({ createdAt: -1 });
            return invitations;
        }
        catch (error) {
            logger_1.default.error("InvitationService: getInvitationsExc", "errorInfo:" + JSON.stringify(error));
            throw error;
        }
    };
    sendInvitationExc = async (senderId, receiverId, senderAccountType) => {
        try {
            const sender = await User_1.default.findById(senderId);
            if (!sender) {
                throw new Error(strings_1.default.SENDER_NOT_FOUND);
            }
            const receiver = await User_1.default.findById(receiverId);
            if (!receiver) {
                throw new Error(strings_1.default.RECEIVER_NOT_FOUND);
            }
            const invitation = new invitations_1.default({
                senderId,
                receiverId,
                senderAccountType,
                companyName: sender.accountType === "carer"
                    ? `${sender.fname} ${sender.lname}`
                    : sender.company?.name,
            });
            await invitation.save();
            return invitation;
        }
        catch (error) {
            logger_1.default.error("InvitationService: sendInvitationExc", "errorInfo:" + JSON.stringify(error));
            throw error;
        }
    };
    acceptInvitationExc = async (invitationId, userId) => {
        try {
            const invitation = await invitations_1.default.findById(invitationId);
            console.log(invitation, "invitation");
            if (!invitation) {
                throw new ErrorHelper_1.default(strings_1.default.INVITATION_NOT_FOUND, statusCodes_1.default.NOT_FOUND);
            }
            console.log(userId, "userId");
            if (invitation.receiverId.toString() !== userId.toString()) {
                throw new ErrorHelper_1.default("Unauthorized to accept invitation", statusCodes_1.default.UNAUTHORIZED);
            }
            if (invitation.status !== "pending") {
                throw new Error(strings_1.default.INVITATION_NO_LONGER_PENDING);
            }
            invitation.status = "accepted";
            await invitation.save();
            return invitation;
        }
        catch (error) {
            console.log(error, "error andi");
            if (error instanceof ErrorHelper_1.default) {
                throw error.message;
            }
            throw error;
        }
    };
    rejectInvitationExc = async (invitationId, userId) => {
        try {
            const invitation = await invitations_1.default.findById(invitationId);
            if (!invitation) {
                throw new ErrorHelper_1.default(strings_1.default.INVITATION_NOT_FOUND, statusCodes_1.default.NOT_FOUND);
            }
            if (invitation.receiverId.toString() !== userId.toString()) {
                throw new ErrorHelper_1.default("Unauthorized to reject invitation", statusCodes_1.default.UNAUTHORIZED);
            }
            if (invitation.status !== "pending") {
                throw new Error(strings_1.default.INVITATION_NO_LONGER_PENDING);
            }
            invitation.status = "rejected";
            await invitation.save();
            return invitation;
        }
        catch (error) {
            logger_1.default.error("InvitationService: rejectInvitationExc", "errorInfo:" + JSON.stringify(error));
            throw error;
        }
    };
    cancelInvitationExc = async (invitationId, userId) => {
        try {
            const invitation = await invitations_1.default.findById(invitationId);
            if (!invitation) {
                throw new Error(strings_1.default.INVITATION_NOT_FOUND);
            }
            if (invitation.senderId.toString() !== userId.toString()) {
                if (invitation.status !== "rejected") {
                    throw new Error(strings_1.default.UNAUTHORIZED_TO_CANCEL_INVITATION);
                }
            }
            await invitations_1.default.findByIdAndDelete(invitationId);
        }
        catch (error) {
            logger_1.default.error("InvitationService: cancelInvitationExc", "errorInfo:" + JSON.stringify(error));
            throw error;
        }
    };
}
exports.default = InvitationService;
//# sourceMappingURL=InvitationService.js.map