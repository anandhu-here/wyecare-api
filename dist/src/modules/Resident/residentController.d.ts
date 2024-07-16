import { IRequest as Request, IResponse as Response } from "src/interfaces/core/express";
declare class ResidentController {
    private residentService;
    private processPersonalCareData;
    constructor();
    createResident: (req: Request, res: Response) => Promise<void>;
    updateResident: (req: Request, res: Response) => Promise<void>;
    getResident: (req: Request, res: Response) => Promise<void>;
    getResidents: (req: Request, res: Response) => Promise<void>;
}
export default ResidentController;
