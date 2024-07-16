import mongoose, { Document } from "mongoose";
export interface IResident extends Document {
    homeId: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    roomNumber: string;
    profilePictureUrl?: string;
    type: "Permanent" | "Temporary" | "Respite";
    medications: Array<{
        type: string;
        frequency: {
            times: number;
            per: "day" | "week";
        };
        label: string;
        medicineName: string;
        timings: string[];
    }>;
    personalCare: {
        [key: string]: {
            frequency: {
                times: number;
                per: "day" | "week";
            };
            timings?: string[];
            defaultTime?: string;
        };
    };
}
declare const _default: mongoose.Model<IResident, {}, {}, {}, mongoose.Document<unknown, {}, IResident> & IResident & Required<{
    _id: unknown;
}>, any>;
export default _default;
