import type { IUserModel } from "../interfaces/entities/user";
declare const User: import("mongoose").Model<IUserModel, {}, {}, {}, import("mongoose").Document<unknown, {}, IUserModel> & IUserModel & Required<{
    _id: unknown;
}>, any>;
export default User;
