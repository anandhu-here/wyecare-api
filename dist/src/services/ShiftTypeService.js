"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const ShiftType_1 = __importDefault(require("src/models/ShiftType"));
class UserShiftTypeService {
    createExc = async (newUserShift) => {
        try {
            console.log("UserShiftTypeService: createExc", "newUserShift:" + JSON.stringify(newUserShift));
            const existingUserShift = await ShiftType_1.default.findOne({
                userId: newUserShift.userId,
            });
            if (existingUserShift) {
                existingUserShift.shifttypes = [
                    ...existingUserShift.shifttypes,
                    ...newUserShift.shifttypes,
                ];
                const updatedUserShift = await existingUserShift.save();
                return Promise.resolve(updatedUserShift);
            }
            else {
                const userShift = await ShiftType_1.default.create({
                    userId: newUserShift.userId,
                    shifttypes: newUserShift.shifttypes,
                });
                return Promise.resolve(userShift);
            }
        }
        catch (error) {
            logger_1.default.error("UserShiftTypeService: createExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    checkShiftType = async (userId) => {
        try {
            const userShift = await ShiftType_1.default.findOne({ userId });
            return userShift;
        }
        catch (error) {
            logger_1.default.error("UserShiftTypeService: checkShiftType", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    findByUserIdExc = async (userId) => {
        try {
            const userShift = await ShiftType_1.default.findOne({ userId });
            return Promise.resolve(userShift);
        }
        catch (error) {
            logger_1.default.error("UserShiftTypeService: findByUserIdExc", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    deleteShiftType = async (userId, shiftTypeId) => {
        try {
            const userShift = await ShiftType_1.default.findOneAndUpdate({ userId }, { $pull: { shifttypes: { _id: shiftTypeId } } }, { new: true });
            return userShift;
        }
        catch (error) {
            logger_1.default.error("UserShiftTypeService: deleteShiftType", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    deleteUserShift = async (userId) => {
        try {
            const deletedUserShift = await ShiftType_1.default.findOneAndDelete({ userId });
            return deletedUserShift;
        }
        catch (error) {
            logger_1.default.error("UserShiftTypeService: deleteUserShift", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
    editShiftType = async (userId, shiftTypeId, updatedShiftType) => {
        try {
            const userShift = await ShiftType_1.default.findOneAndUpdate({ userId, "shifttypes._id": shiftTypeId }, { $set: { "shifttypes.$": updatedShiftType } }, { new: true });
            return userShift;
        }
        catch (error) {
            logger_1.default.error("UserShiftTypeService: editShiftType", "errorInfo:" + JSON.stringify(error));
            return Promise.reject(error);
        }
    };
}
exports.default = UserShiftTypeService;
//# sourceMappingURL=ShiftTypeService.js.map