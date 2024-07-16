import { IRequest, IResponse } from "src/interfaces/core/express";
declare class EmailController {
    private readonly emailService;
    private readonly transporter;
    private readonly userSvc;
    constructor();
    sendEmail: (req: IRequest, res: IResponse) => Promise<IResponse>;
}
export default EmailController;
