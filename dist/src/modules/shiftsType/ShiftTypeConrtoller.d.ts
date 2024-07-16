import type { IRequest, IResponse, INext } from "../../interfaces/core/express";
import type UserShiftService from "src/services/ShiftTypeService";
import type { RequestShiftType } from "src/interfaces/requests/shifttype.interface";
declare class UserShiftController {
    readonly userShiftSvc: UserShiftService;
    private readonly _userShiftSvc;
    constructor(userShiftSvc: UserShiftService);
    createUserShiftsTypes: (req: IRequest, res: IResponse, next: INext) => Promise<any>;
    getUserShiftTypes: (req: IRequest, res: IResponse, next: INext) => Promise<any>;
    deleteShiftType: (req: RequestShiftType, res: IResponse) => Promise<any>;
    deleteUserShift: (req: RequestShiftType, res: IResponse) => Promise<any>;
    editShiftType: (req: RequestShiftType, res: IResponse) => Promise<any>;
}
export default UserShiftController;
