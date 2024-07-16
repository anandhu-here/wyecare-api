"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("src/logger"));
const ResidentService_1 = __importDefault(require("src/services/ResidentService"));
class ResidentController {
    residentService;
    processPersonalCareData(data) {
        Object.keys(data.personalCare).forEach((key) => {
            const item = data.personalCare[key];
            if (item.frequency &&
                item.frequency.per === "week" &&
                Array.isArray(item.timings)) {
                item.timings = item.timings.map((timing) => {
                    if (typeof timing === "object" && timing.day && timing.time) {
                        return { day: timing.day, time: timing.time };
                    }
                    return timing;
                });
            }
        });
        return data;
    }
    constructor() {
        this.residentService = new ResidentService_1.default();
    }
    createResident = async (req, res) => {
        try {
            const residentData = req.body;
            const newResident = await this.residentService.createResident(residentData);
            res.status(201).json({ success: true, data: newResident });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    };
    updateResident = async (req, res) => {
        try {
            const { residentId } = req.params;
            let updateData = req.body;
            if (updateData.personalCare) {
                updateData = this.processPersonalCareData(updateData);
            }
            const updatedResident = await this.residentService.updateResident(residentId, updateData);
            res.status(200).json({ success: true, data: updatedResident });
        }
        catch (error) {
            console.log(error, "error");
            res.status(400).json({ success: false, error: error.message });
        }
    };
    getResident = async (req, res) => {
        try {
            const { residentId } = req.params;
            const resident = await this.residentService.getResident(residentId);
            res.status(200).json({ success: true, data: resident });
        }
        catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    };
    getResidents = async (req, res) => {
        try {
            logger_1.default.info("getResidents");
            const { homeId } = req.params;
            console.log(homeId, "homeId");
            if (typeof homeId !== "string") {
                throw new Error("Invalid homeId");
            }
            const residents = await this.residentService.getResidents(homeId);
            res.status(200).json({ success: true, data: residents });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    };
}
exports.default = ResidentController;
//# sourceMappingURL=residentController.js.map