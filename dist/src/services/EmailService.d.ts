import { IEmail } from "src/interfaces/entities/email";
declare class EmailServices {
    private readonly transporter;
    private readonly email;
    private readonly password;
    constructor();
    sendEmail: (emailOptions: IEmail) => Promise<boolean>;
}
export default EmailServices;
