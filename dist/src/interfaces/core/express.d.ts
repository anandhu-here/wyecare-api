import type { NextFunction, Request, Response } from "express";
import type { IUserModel } from "../entities/user";
import { UploadedFile } from "express-fileupload";
export interface IRequest extends Request {
    currentUser?: IUserModel;
    token?: string;
    invToken?: string;
    files?: {
        [key: string]: UploadedFile;
    };
}
export interface IResponse extends Response {
}
export interface INext extends NextFunction {
}
