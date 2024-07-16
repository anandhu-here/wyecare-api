import mongoose from "mongoose";
import { IHomeStaffINvitiation } from "src/interfaces/entities/home-staff-invitation";
declare const HomeStaffInvitation: mongoose.Model<IHomeStaffINvitiation, {}, {}, {}, mongoose.Document<unknown, {}, IHomeStaffINvitiation> & IHomeStaffINvitiation & Required<{
    _id: unknown;
}>, any>;
export default HomeStaffInvitation;
