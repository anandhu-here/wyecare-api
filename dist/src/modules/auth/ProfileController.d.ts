import type { IRequest, IResponse, INext } from "../../interfaces/core/express";
import type ProfileService from "src/services/ProfileService";
import UserService from "src/services/UserService";
declare class ProfileController {
    readonly profileSvc: ProfileService;
    readonly userSvc: UserService;
    private readonly _userSvc;
    private readonly _profileSvc;
    constructor(profileSvc: ProfileService, userSvc: UserService);
    getProfileDetails: (req: IRequest, res: IResponse, next: INext) => Promise<any>;
    getLinkedUsers: (req: IRequest, res: IResponse) => Promise<any>;
    updateAvailabilities: (req: IRequest, res: IResponse) => Promise<void>;
    deleteAvailability: (req: IRequest, res: IResponse) => Promise<void>;
    searchUsers: (req: IRequest, res: IResponse, next: INext) => Promise<any>;
    getUsers: (req: IRequest, res: IResponse) => Promise<any>;
}
export default ProfileController;
