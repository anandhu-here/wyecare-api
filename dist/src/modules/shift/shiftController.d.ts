import { Response } from "express";
import type { IRequest, IResponse } from "src/interfaces/core/express";
declare class ShiftController {
    private readonly _shiftSvc;
    private readonly _shiftTypeSvc;
    constructor();
    getShiftById: (req: IRequest, res: Response) => Promise<void>;
    getShifts: (req: IRequest, res: Response) => Promise<void>;
    getUnAcceptedShifts: (req: IRequest, res: IResponse) => Promise<void>;
    createShift: (req: IRequest, res: Response) => Promise<void>;
    createMultipleShifts: (req: IRequest, res: Response) => Promise<void>;
    deleteShift: (req: IRequest, res: Response) => Promise<void>;
    updateShift: (req: IRequest, res: Response) => Promise<void>;
    acceptShift: (req: IRequest, res: Response) => Promise<void>;
    rejectShift: (req: IRequest, res: Response) => Promise<void>;
    assignUsers: (req: IRequest, res: Response) => Promise<void>;
    assignCarersToShift: (req: IRequest, res: IResponse) => Promise<void>;
    unassignCarerFromShift: (req: IRequest, res: Response) => Promise<void>;
    generateQRCode: (req: IRequest, res: IResponse) => Promise<void>;
    verifyPublicKey: (req: IRequest, res: IResponse) => Promise<void>;
}
export default ShiftController;
