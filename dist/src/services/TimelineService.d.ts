import { Types, Schema } from "mongoose";
import { ITimeline } from "../interfaces/entities/timeline";
import { IUser } from "src/interfaces/entities/user";
declare class TimelineService {
    getCurrentAgency: (carerId: Types.ObjectId) => Promise<(Partial<IUser> & {
        startDate: Date;
        endDate: Date;
    }) | null>;
    getPreviousAgencies: (carerId: Types.ObjectId) => Promise<(Partial<IUser> & {
        startDate: Date;
        endDate: Date;
    })[]>;
    addAgencyToTimeline: (carerId: Types.ObjectId, newAgencyId: Schema.Types.ObjectId, newAgencyStartDate: Date, newAgencyDescription: string) => Promise<ITimeline>;
    removeCurrentAgency: (carerId: Types.ObjectId) => Promise<ITimeline | null>;
}
export default TimelineService;
