"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Resident_1 = __importDefault(require("../models/Resident"));
class ResidentService {
    async createResident(residentData) {
        try {
            const resident = new Resident_1.default(residentData);
            await resident.save();
            return resident;
        }
        catch (error) {
            throw new Error(`Failed to create resident: ${error.message}`);
        }
    }
    async updateResident(residentId, updateData) {
        try {
            const updatedResident = await Resident_1.default.findByIdAndUpdate(residentId, updateData, { new: true, runValidators: true });
            if (!updatedResident) {
                throw new Error("Resident not found");
            }
            return updatedResident;
        }
        catch (error) {
            throw new Error(`Failed to update resident: ${error.message}`);
        }
    }
    async getResident(residentId) {
        try {
            const resident = await Resident_1.default.findById(residentId);
            if (!resident) {
                throw new Error("Resident not found");
            }
            return resident;
        }
        catch (error) {
            throw new Error(`Failed to get resident: ${error.message}`);
        }
    }
    async getResidents(homeId) {
        try {
            console.log(homeId, "hhhh");
            return await Resident_1.default.find({ homeId });
        }
        catch (error) {
            console.log(error, "eror");
            throw new Error(`Failed to get residents: ${error.message}`);
        }
    }
}
exports.default = ResidentService;
//# sourceMappingURL=ResidentService.js.map