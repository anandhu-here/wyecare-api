import { Schema } from "mongoose";
import type { IShift } from "src/interfaces/entities/shift";
export declare const ShiftSchema: Schema;
declare const ShiftModel: import("mongoose").Model<IShift, {}, {}, {}, import("mongoose").Document<unknown, {}, IShift> & IShift & Required<{
    _id: unknown;
}>, any>;
export default ShiftModel;
