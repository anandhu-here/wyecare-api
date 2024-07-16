import type { ObjectId, UpdateQuery } from "mongoose";
import type { IUser, IUserModel } from "../interfaces/entities/user";
declare class UserService {
    createUserExc: (_user: Partial<IUser>) => Promise<IUserModel>;
    searchUsersExc: (accountType?: string, companyName?: string) => Promise<IUserModel[]>;
    findUserByIdExc: (_userId: string | ObjectId) => Promise<IUserModel>;
    findUserByEmailExc: (_email: string) => Promise<IUserModel>;
    getUsers: (userType: string) => Promise<IUserModel[]>;
    checkIsEmailExistsExc: (_email: string) => Promise<boolean>;
    checkIsUsernameExistsExc: (_username: string) => Promise<boolean>;
    checkIsPhoneExistsExc: (_phone: string) => Promise<boolean>;
    updateUser(userId: string, updateData: UpdateQuery<IUser>): Promise<IUser | null>;
    removeLinkedUser(userId: string, linkedUserType: string, linkedUserId: string): Promise<IUser | null>;
}
export default UserService;
