import { Response, NextFunction } from "express";
import type { IRequest } from "src/interfaces/core/express";
declare const removeLinkedUserValidator: (req: IRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export default removeLinkedUserValidator;
