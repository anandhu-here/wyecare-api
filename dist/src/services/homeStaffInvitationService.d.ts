import { IHomeStaffINvitiation } from "src/interfaces/entities/home-staff-invitation";
declare class HomeStaffInvitationService {
    getInvitations: (userId: string) => Promise<IHomeStaffINvitiation[]>;
    sendInvitation: (senderId: string, receiverEmail: string, accountType: string, companyName: string, senderAccountType: string) => Promise<IHomeStaffINvitiation>;
    updateInvitationStatus: (invitationId: string, status: "accepted" | "rejected") => Promise<IHomeStaffINvitiation>;
    getInvitationByToken: (token: string) => Promise<IHomeStaffINvitiation | null>;
    deleteInvitation: (invitationId: string, userId: string) => Promise<void>;
}
export default HomeStaffInvitationService;
