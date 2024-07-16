import type { INext, IRequest, IResponse } from "../interfaces/core/express";
import type { NextFunction } from "express";
declare class AuthMiddleware {
    static isAuthenticatedUser(req: IRequest, res: IResponse, next: INext): Promise<any>;
    static validateRegistration(req: IRequest, res: IResponse, next: NextFunction): Promise<any>;
}
export default AuthMiddleware;
