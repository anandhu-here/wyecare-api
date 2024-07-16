import type { IAuthTokenModel } from "../interfaces/entities/authToken";
declare const AuthToken: import("mongoose").Model<IAuthTokenModel, {}, {}, {}, import("mongoose").Document<unknown, {}, IAuthTokenModel> & IAuthTokenModel & Required<{
    _id: unknown;
}>, any>;
export default AuthToken;
