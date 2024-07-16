import type { ILinkedUser, IUser, IUserModel } from "src/interfaces/entities/user";
declare class ProfileService {
    getProfileExc: (currentUser: IUserModel) => Promise<any>;
    getLinkedUsers(userId: string, accountType?: string): Promise<ILinkedUser[]>;
    updateAvailabilities(userId: string, dates: string[]): Promise<IUser | null>;
    deleteAvailability(userId: string, date: string): Promise<IUser | null>;
}
export default ProfileService;
