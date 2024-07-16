import type { IOtpModel } from "../interfaces/entities/otp";
declare const Otp: import("mongoose").Model<IOtpModel, {}, {}, {}, import("mongoose").Document<unknown, {}, IOtpModel> & IOtpModel & Required<{
    _id: unknown;
}>, any>;
export default Otp;
