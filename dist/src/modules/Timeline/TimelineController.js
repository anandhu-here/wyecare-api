"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = __importDefault(require("src/constants/statusCodes"));
const TimelineService_1 = __importDefault(require("src/services/TimelineService"));
class TimelineController {
    _timelineService;
    constructor() {
        this._timelineService = new TimelineService_1.default();
    }
    getCurrentAgency = async (req, res) => {
        try {
            const carerId = req.currentUser._id;
            const currentAgency = await this._timelineService.getCurrentAgency(carerId);
            if (!currentAgency) {
                res
                    .status(statusCodes_1.default.NOT_FOUND)
                    .json({ message: "Current agency not found" });
                return;
            }
            res.status(statusCodes_1.default.OK).json(currentAgency);
        }
        catch (error) {
            console.error("Error getting current agency:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };
    getPreviousAgencies = async (req, res) => {
        try {
            const carerId = req.currentUser._id;
            const previousAgencies = await this._timelineService.getPreviousAgencies(carerId);
            res.status(statusCodes_1.default.OK).json(previousAgencies);
        }
        catch (error) {
            console.error("Error getting previous agencies:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };
    addAgencyToTimeline = async (req, res) => {
        try {
            const carerId = req.currentUser._id;
            const { newAgencyId, newAgencyStartDate, newAgencyDescription } = req.body;
            const updatedTimeline = await this._timelineService.addAgencyToTimeline(carerId, newAgencyId, newAgencyStartDate, newAgencyDescription);
            res.status(statusCodes_1.default.OK).json(updatedTimeline);
        }
        catch (error) {
            console.error("Error adding agency to timeline:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };
    removeCurrentAgency = async (req, res) => {
        try {
            const carerId = req.currentUser._id;
            const updatedTimeline = await this._timelineService.removeCurrentAgency(carerId);
            if (!updatedTimeline) {
                res
                    .status(statusCodes_1.default.NOT_FOUND)
                    .json({ message: "Timeline not found" });
                return;
            }
            res.status(statusCodes_1.default.OK).json(updatedTimeline);
        }
        catch (error) {
            console.error("Error removing current agency:", error);
            res
                .status(statusCodes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    };
}
exports.default = TimelineController;
//# sourceMappingURL=TimelineController.js.map