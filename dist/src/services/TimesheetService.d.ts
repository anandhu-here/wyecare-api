import { ITimesheet } from "../interfaces/entities/timesheet";
declare class TimesheetService {
    createTimesheet: (shiftId: string, carerId: string) => Promise<ITimesheet>;
    getTimesheets: (accountType: string, userId: string) => Promise<ITimesheet[]>;
    getTimesheetsByHomeId: (homeId: string) => Promise<ITimesheet[]>;
    approveTimesheet: (timesheetId: string, rating?: number | null, review?: string | null) => Promise<ITimesheet | null>;
    rejectTimesheet: (timesheetId: string) => Promise<ITimesheet | null>;
}
export default TimesheetService;
