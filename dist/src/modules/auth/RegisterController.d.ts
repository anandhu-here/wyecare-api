import type ProfileService from "../../services/ProfileService";
import type { IRequest, IResponse, INext } from "../../interfaces/core/express";
import type UserService from "../../services/UserService";
import type ShiftService from "src/services/ShiftService";
declare class RegisterController {
    readonly userSvc: UserService;
    readonly profileSvc: ProfileService;
    readonly shiftSvc: ShiftService;
    private readonly _userSvc;
    private readonly _profileSvc;
    private readonly _timeliineSvc;
    constructor(userSvc: UserService, profileSvc: ProfileService, shiftSvc: ShiftService);
    sendRegisterOtp: (req: IRequest, res: IResponse, next: INext) => Promise<any>;
    register: (req: IRequest, res: IResponse, next: INext) => Promise<any>;
    linkUser: (req: IRequest, res: IResponse) => Promise<any>;
    removeLinkedUser: (req: IRequest, res: IResponse) => Promise<any>;
}
export default RegisterController;
