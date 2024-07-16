import { ITimeline } from "../interfaces/entities/timeline";
declare const TimelineModel: import("mongoose").Model<ITimeline, {}, {}, {}, import("mongoose").Document<unknown, {}, ITimeline> & ITimeline & Required<{
    _id: unknown;
}>, any>;
export default TimelineModel;
