import { IRequest, IResponse } from "src/interfaces/core/express";
declare class TimesheetController {
    private readonly _timesheetService;
    constructor();
    createTimesheet: (req: IRequest, res: IResponse) => Promise<void>;
    getTimesheets: (req: IRequest, res: IResponse) => Promise<void>;
    getTimesheetsByHomeId: (req: IRequest, res: IResponse) => Promise<void>;
    approveTimesheet: (req: IRequest, res: IResponse) => Promise<void>;
    rejectTimesheet: (req: IRequest, res: IResponse) => Promise<void>;
}
export default TimesheetController;
