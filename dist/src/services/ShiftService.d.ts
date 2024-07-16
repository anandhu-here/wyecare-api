import { Types } from "mongoose";
import type { IShift } from "src/interfaces/entities/shift";
import type { IShiftType } from "src/interfaces/entities/shift-types";
declare class ShiftService {
    getPublishedShifts: (userId: string | Types.ObjectId) => Promise<IShift[]>;
    getAssignedShifts: (userId: string | Types.ObjectId) => Promise<any>;
    getunAcceptedShifts: (userId: string) => Promise<IShift[]>;
    getShiftById: (shiftId: string | Types.ObjectId) => Promise<IShift | null>;
    getShifts: (userId: string | Types.ObjectId) => Promise<IShift[]>;
    createShift: (shiftData: IShift, shiftType: any) => Promise<IShift>;
    createMultipleShifts: (shiftsData: IShift[], shiftTypes: IShiftType[], homeId: string) => Promise<IShift[]>;
    deleteShift: (shiftId: string | Types.ObjectId) => Promise<IShift | null>;
    updateShift: (shiftId: string, updatedShiftData: Partial<IShift>, shiftType: any) => Promise<IShift | null>;
    acceptShift: (shiftId: string) => Promise<IShift | null>;
    rejectShift: (shiftId: string) => Promise<IShift | null>;
    assignUsers: (shiftId: string, userIds: string[]) => Promise<IShift | null>;
    assignCarersToShift(shiftId: string, validCarerIds: Types.ObjectId[]): Promise<IShift | null>;
    unassignCarerFromShift(shiftId: string, carerId: Types.ObjectId): Promise<IShift | null>;
    generateQRCode(shiftId: string): Promise<{
        publicKey: string;
        qrCodeData: string;
    }>;
    verifyPublicKey(shiftId: string, publicKey: string, carerId: string): Promise<boolean>;
}
export default ShiftService;
