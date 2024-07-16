import { NextFunction } from "express";
import { IRequest, IResponse } from "src/interfaces/core/express";
import UserService from "src/services/UserService";
import HomeStaffInvitationService from "src/services/homeStaffInvitationService";
declare class HomeStaffInvitation {
    readonly invitationSvc: HomeStaffInvitationService;
    readonly userSvc: UserService;
    private readonly _invitationSvc;
    private readonly _userSvc;
    private readonly _emailSvc;
    constructor(invitationSvc: HomeStaffInvitationService, userSvc: UserService);
    getInvitations: (req: IRequest, res: IResponse, next: NextFunction) => Promise<any>;
    sendInvitation: (req: IRequest, res: IResponse, next: NextFunction) => Promise<any>;
    updateInvitationStatus: (req: IRequest, res: IResponse, next: NextFunction) => Promise<any>;
    getInvitationByToken: (req: IRequest, res: IResponse, next: NextFunction) => Promise<any>;
}
export default HomeStaffInvitation;
