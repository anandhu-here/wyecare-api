import { IEmail } from "src/interfaces/entities/email";
declare class WyeMailer {
    private transporter;
    constructor(email: string, password: string);
    getTransporter(): any;
    sendMail(mailOptions: IEmail): Promise<any>;
}
export default WyeMailer;
