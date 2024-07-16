import { IJoinInvitation } from "src/interfaces/entities/invitations";
declare class InvitationService {
    getInvitationsExc: (userId: string) => Promise<IJoinInvitation[]>;
    sendInvitationExc: (senderId: string, receiverId: string, senderAccountType: string) => Promise<IJoinInvitation>;
    acceptInvitationExc: (invitationId: string, userId: string) => Promise<IJoinInvitation>;
    rejectInvitationExc: (invitationId: string, userId: string) => Promise<IJoinInvitation>;
    cancelInvitationExc: (invitationId: string, userId: string) => Promise<void>;
}
export default InvitationService;
