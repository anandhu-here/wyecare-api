import { Schema, Types } from "mongoose";
import type { IUserShiftTypeModel } from "src/interfaces/entities/shift-types";
export declare const ShiftTypeSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    name: string;
    startTime: string;
    endTime: string;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    name: string;
    startTime: string;
    endTime: string;
}>> & import("mongoose").FlatRecord<{
    name: string;
    startTime: string;
    endTime: string;
}> & {
    _id: Types.ObjectId;
}>;
declare const ShiftType: import("mongoose").Model<IUserShiftTypeModel, {}, {}, {}, import("mongoose").Document<unknown, {}, IUserShiftTypeModel> & IUserShiftTypeModel & Required<{
    _id: unknown;
}>, any>;
export default ShiftType;
