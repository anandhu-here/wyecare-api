import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import type { IRequest } from "src/interfaces/core/express";
declare class ShiftMiddleware {
    validateShiftRequest(schema: Schema): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
    validateAssignCarers(req: IRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    validateUnassignCarer(req: IRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
declare const _default: ShiftMiddleware;
export default _default;
