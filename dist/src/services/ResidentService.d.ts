import { IResident } from "../models/Resident";
declare class ResidentService {
    createResident(residentData: Partial<IResident>): Promise<IResident>;
    updateResident(residentId: string, updateData: Partial<IResident>): Promise<IResident | null>;
    getResident(residentId: string): Promise<IResident | null>;
    getResidents(homeId: string): Promise<IResident[]>;
}
export default ResidentService;
