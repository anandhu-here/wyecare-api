import { NextFunction } from "express";
import { IRequest, IResponse } from "src/interfaces/core/express";
declare class InvitationMidleWare {
    static validateInvitation(req: IRequest, res: IResponse, next: NextFunction): Promise<any>;
}
export default InvitationMidleWare;
