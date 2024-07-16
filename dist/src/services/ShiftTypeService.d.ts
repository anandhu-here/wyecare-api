import type { IUserShiftType, IUserShiftTypeModel } from "src/interfaces/entities/shift-types";
declare class UserShiftTypeService {
    createExc: (newUserShift: IUserShiftType) => Promise<IUserShiftTypeModel>;
    checkShiftType: (userId: string) => Promise<IUserShiftType>;
    findByUserIdExc: (userId: string) => Promise<IUserShiftTypeModel | null>;
    deleteShiftType: (userId: string, shiftTypeId: string) => Promise<IUserShiftTypeModel | null>;
    deleteUserShift: (userId: string) => Promise<IUserShiftTypeModel | null>;
    editShiftType: (userId: string, shiftTypeId: string, updatedShiftType: IUserShiftType) => Promise<IUserShiftTypeModel | null>;
}
export default UserShiftTypeService;
