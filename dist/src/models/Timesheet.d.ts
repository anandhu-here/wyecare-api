import { ITimesheet } from "../interfaces/entities/timesheet";
declare const TimesheetModel: import("mongoose").Model<ITimesheet, {}, {}, {}, import("mongoose").Document<unknown, {}, ITimesheet> & ITimesheet & Required<{
    _id: unknown;
}>, any>;
export default TimesheetModel;
