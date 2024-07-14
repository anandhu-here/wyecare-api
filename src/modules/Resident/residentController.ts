import { IRequest, IResponse } from "src/interfaces/core/express";

import StringValues from "src/constants/strings";
import ResidentService from "src/services/ResidentService";

class ResidentController {
  private readonly _residentService: ResidentService;

  constructor() {
    this._residentService = new ResidentService();
  }

  public async getResidents(req: IRequest, res: IResponse) {
    try {
      const filters = req.query; // You can pass query parameters as filters
      const residents = await this._residentService.getResidents(filters);
      res.status(200).json({ success: true, data: residents });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public async createResident(req: IRequest, res: IResponse) {
    try {
      const residentData = req.body;
      const resident = await this._residentService.createResident(residentData);
      res.status(201).json({ success: true, data: resident });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public async getResident(req: IRequest, res: IResponse) {
    try {
      const { residentId } = req.params;
      const resident = await this._residentService.getResident(residentId);
      if (!resident) {
        return res
          .status(404)
          .json({ success: false, error: "Resident not found" });
      }
      res.status(200).json({ success: true, data: resident });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public async updateResident(req: IRequest, res: IResponse) {
    try {
      const { residentId } = req.params;
      const updateData = req.body;
      const updatedResident = await this._residentService.updateResident(
        residentId,
        updateData
      );
      if (!updatedResident) {
        return res
          .status(404)
          .json({ success: false, error: "Resident not found" });
      }
      res.status(200).json({ success: true, data: updatedResident });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public async deleteResident(req: IRequest, res: IResponse) {
    try {
      const { residentId } = req.params;
      await this._residentService.deleteResident(residentId);
      res
        .status(200)
        .json({ success: true, message: "Resident deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public async addCareTimelineEntry(req: IRequest, res: IResponse) {
    try {
      const { residentId } = req.params;
      const { carerId, careType, details } = req.body;
      const updatedResident = await this._residentService.addCareTimelineEntry(
        residentId,
        carerId,
        careType,
        details
      );
      if (!updatedResident) {
        return res
          .status(404)
          .json({ success: false, error: "Resident not found" });
      }
      res.status(200).json({ success: true, data: updatedResident });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public async addMedicationTimelineEntry(req: IRequest, res: IResponse) {
    try {
      const { residentId } = req.params;
      const { medicationId, nurseId } = req.body;
      const updatedResident =
        await this._residentService.addMedicationTimelineEntry(
          residentId,
          medicationId,
          nurseId
        );
      if (!updatedResident) {
        return res
          .status(404)
          .json({ success: false, error: "Resident not found" });
      }
      res.status(200).json({ success: true, data: updatedResident });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public async updatePersonalCare(req: IRequest, res: IResponse) {
    try {
      const { residentId } = req.params;
      const personalCare = req.body;
      const updatedResident = await this._residentService.updatePersonalCare(
        residentId,
        personalCare
      );
      if (!updatedResident) {
        return res
          .status(404)
          .json({ success: false, error: "Resident not found" });
      }
      res.status(200).json({ success: true, data: updatedResident });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default ResidentController;
