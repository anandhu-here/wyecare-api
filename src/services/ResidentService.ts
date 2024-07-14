import Resident from "../models/Resident";
import { IResident, IPersonalCare } from "../interfaces/entities/resident";
import { Types } from "mongoose";

class ResidentService {
  public async createResident(
    residentData: Partial<IResident>
  ): Promise<IResident> {
    try {
      const resident = new Resident(residentData);
      await resident.save();
      return resident;
    } catch (error: any) {
      throw new Error(`Failed to create resident: ${error.message}`);
    }
  }

  public async getResidents(filters: any = {}): Promise<IResident[]> {
    try {
      return await Resident.find(filters);
    } catch (error: any) {
      throw new Error(`Failed to get residents: ${error.message}`);
    }
  }

  public async getResident(residentId: string): Promise<IResident | null> {
    try {
      return await Resident.findById(residentId);
    } catch (error: any) {
      throw new Error(`Failed to get resident: ${error.message}`);
    }
  }

  public async updateResident(
    residentId: string,
    updateData: Partial<IResident>
  ): Promise<IResident | null> {
    try {
      return await Resident.findByIdAndUpdate(residentId, updateData, {
        new: true,
      });
    } catch (error: any) {
      throw new Error(`Failed to update resident: ${error.message}`);
    }
  }

  public async deleteResident(residentId: string): Promise<void> {
    try {
      await Resident.findByIdAndDelete(residentId);
    } catch (error: any) {
      throw new Error(`Failed to delete resident: ${error.message}`);
    }
  }

  public async addCareTimelineEntry(
    residentId: string,
    carerId: string,
    careType: string,
    details: any
  ): Promise<IResident | null> {
    try {
      return await Resident.findByIdAndUpdate(
        residentId,
        {
          $push: {
            careTimeline: {
              carerId: new Types.ObjectId(carerId),
              careType,
              details,
              time: new Date(),
            },
          },
        },
        { new: true }
      );
    } catch (error: any) {
      throw new Error(`Failed to add care timeline entry: ${error.message}`);
    }
  }

  public async addMedicationTimelineEntry(
    residentId: string,
    medicationId: string,
    nurseId: string
  ): Promise<IResident | null> {
    try {
      return await Resident.findByIdAndUpdate(
        residentId,
        {
          $push: {
            medicationsTimeline: {
              medicationId: new Types.ObjectId(medicationId),
              nurseId: new Types.ObjectId(nurseId),
              time: new Date(),
            },
          },
        },
        { new: true }
      );
    } catch (error: any) {
      throw new Error(
        `Failed to add medication timeline entry: ${error.message}`
      );
    }
  }

  public async updatePersonalCare(
    residentId: string,
    personalCare: IPersonalCare
  ): Promise<IResident | null> {
    try {
      return await Resident.findByIdAndUpdate(
        residentId,
        { personalCare },
        { new: true }
      );
    } catch (error: any) {
      throw new Error(`Failed to update personal care: ${error.message}`);
    }
  }
}

export default ResidentService;
