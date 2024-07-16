import type { NextFunction } from "express";
import Joi from "joi";
import type { IRequest, IResponse } from "src/interfaces/core/express";
export declare const createShiftSchema: Joi.ObjectSchema<any>;
export declare const assignCarersSchema: Joi.ObjectSchema<any>;
declare const validateAgencyAccept: (req: IRequest, res: IResponse, next: NextFunction) => Promise<IResponse>;
export default validateAgencyAccept;
