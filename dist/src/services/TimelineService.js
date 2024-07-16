"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Timeline_1 = __importDefault(require("../models/Timeline"));
class TimelineService {
    getCurrentAgency = async (carerId) => {
        const timeline = await Timeline_1.default.findOne({ carerId })
            .populate({
            path: "timeline",
            model: "TimelineItem",
            match: { agencyId: { $eq: "$currentAgency" } },
            select: "dateStarted dateEnded agencyId",
            options: { limit: 1 },
        })
            .populate({
            path: "currentAgency",
            model: "User",
            select: "fname lname company",
        })
            .exec();
        if (!timeline || !timeline.currentAgency) {
            return null;
        }
        const [currentAgencyItem] = timeline.timeline;
        const { fname, lname, company, _id } = timeline.currentAgency;
        return {
            fname,
            lname,
            company,
            startDate: currentAgencyItem?.dateStarted || null,
            endDate: currentAgencyItem?.dateEnded || null,
        };
    };
    getPreviousAgencies = async (carerId) => {
        const timeline = await Timeline_1.default.findOne({ carerId })
            .populate({
            path: "timeline",
            model: "TimelineItem",
            select: "dateStarted dateEnded agencyId",
        })
            .populate({
            path: "timeline.agencyId",
            model: "User",
            select: "fname lname company",
        })
            .exec();
        if (!timeline) {
            return [];
        }
        return timeline.timeline
            .filter((item) => item.agencyId._id?.toString() !== timeline.currentAgency?.toString())
            .map((item) => ({
            _id: item.agencyId._id,
            fname: item.agencyId.fname,
            lname: item.agencyId.lname,
            company: item.agencyId.company,
            startDate: item.dateStarted,
            endDate: item.dateEnded,
        }));
    };
    addAgencyToTimeline = async (carerId, newAgencyId, newAgencyStartDate, newAgencyDescription) => {
        let timeline = await Timeline_1.default.findOne({ carerId });
        if (!timeline) {
            timeline = await Timeline_1.default.create({
                carerId,
                currentAgency: newAgencyId,
                timeline: [
                    {
                        dateStarted: newAgencyStartDate,
                        dateEnded: new Date(),
                        agencyId: newAgencyId,
                        description: newAgencyDescription,
                    },
                ],
            });
            return timeline;
        }
        if (timeline.currentAgency?.toString() !== newAgencyId.toString()) {
            timeline.timeline.unshift({
                dateStarted: timeline.timeline[0]?.dateStarted || new Date(),
                dateEnded: new Date(),
                agencyId: timeline.currentAgency,
                description: timeline.timeline[0]?.description || "",
            });
            timeline.currentAgency = newAgencyId;
            timeline.timeline[0] = {
                dateStarted: newAgencyStartDate,
                dateEnded: new Date(),
                agencyId: newAgencyId,
                description: newAgencyDescription,
            };
        }
        await timeline.save();
        return timeline;
    };
    removeCurrentAgency = async (carerId) => {
        const timeline = await Timeline_1.default.findOne({ carerId });
        if (!timeline) {
            return null;
        }
        timeline.timeline.unshift({
            dateStarted: timeline.timeline[0]?.dateStarted || new Date(),
            dateEnded: new Date(),
            agencyId: timeline.currentAgency,
            description: timeline.timeline[0]?.description || "",
        });
        timeline.currentAgency = null;
        await timeline.save();
        return timeline;
    };
}
exports.default = TimelineService;
//# sourceMappingURL=TimelineService.js.map