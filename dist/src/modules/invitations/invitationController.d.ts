import { NextFunction } from "express";
import { IRequest, IResponse } from "src/interfaces/core/express";
import InvitationService from "src/services/InvitationService";
import UserService from "src/services/UserService";
declare class Invitation {
    readonly invitationSvc: InvitationService;
    readonly userSvc: UserService;
    private readonly _invitationSvc;
    private readonly _userSvc;
    private readonly _emailSvc;
    constructor(invitationSvc: InvitationService, userSvc: UserService);
    getInvitations: (req: IRequest, res: IResponse, next: NextFunction) => Promise<any>;
    cancelInvitation: (req: IRequest, res: IResponse, next: NextFunction) => Promise<any>;
    sendInvitation: (req: IRequest, res: IResponse, next: NextFunction) => Promise<any>;
    acceptInvitation: (req: IRequest, res: IResponse, next: NextFunction) => Promise<any>;
    rejectInvitation: (req: IRequest, res: IResponse, next: NextFunction) => Promise<any>;
    getInvitation: (req: IRequest, res: IResponse, next: NextFunction) => Promise<any>;
}
export default Invitation;
