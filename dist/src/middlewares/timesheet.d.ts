import { NextFunction } from "express";
import { IRequest, IResponse } from "src/interfaces/core/express";
declare class TimesheetMiddleWare {
    static validateCreateTimesheet(req: IRequest, res: IResponse, next: NextFunction): Promise<IResponse>;
    static validateApproval(req: IRequest, res: IResponse, next: NextFunction): Promise<IResponse>;
}
export default TimesheetMiddleWare;
