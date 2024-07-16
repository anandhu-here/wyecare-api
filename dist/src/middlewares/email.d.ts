import { NextFunction } from "express";
import { IRequest, IResponse } from "src/interfaces/core/express";
declare class EmailMiddleware {
    static validateSendEmail(req: IRequest, res: IResponse, next: NextFunction): Promise<any>;
}
export default EmailMiddleware;
