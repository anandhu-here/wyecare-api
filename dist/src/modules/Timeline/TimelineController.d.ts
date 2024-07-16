import { IRequest, IResponse } from "src/interfaces/core/express";
declare class TimelineController {
    private readonly _timelineService;
    constructor();
    getCurrentAgency: (req: IRequest, res: IResponse) => Promise<void>;
    getPreviousAgencies: (req: IRequest, res: IResponse) => Promise<void>;
    addAgencyToTimeline: (req: IRequest, res: IResponse) => Promise<void>;
    removeCurrentAgency: (req: IRequest, res: IResponse) => Promise<void>;
}
export default TimelineController;
