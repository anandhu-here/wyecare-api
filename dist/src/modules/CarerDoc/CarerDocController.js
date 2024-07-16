"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strings_1 = __importDefault(require("src/constants/strings"));
const CarerService_1 = __importDefault(require("src/services/CarerService"));
class CarerDocumentController {
    _carerDocumentService;
    constructor() {
        this._carerDocumentService = new CarerService_1.default();
    }
    async uploadFiles(req, res) {
        try {
            const carerId = req.params.carerId;
            const files = req.files;
            const { type } = req.body;
            if (!type) {
                return res
                    .status(400)
                    .json({ success: false, error: "No type was provided" });
            }
            if (!files || Object.keys(files).length === 0) {
                return res
                    .status(400)
                    .json({ success: false, error: "No files were uploaded." });
            }
            const results = [];
            for (const key in files) {
                const file = files[key];
                if (type === "document") {
                    console.log(file.name, "file name");
                    const document = await this._carerDocumentService.addDocument(carerId, file, type);
                    results.push({ type: "document", ...document });
                }
                else if (type === "certificate") {
                    const { certificateTypes, expiryDates } = req.body;
                    const certificate = await this._carerDocumentService.addCertificate(carerId, file, type);
                    results.push({ type: "certificate", ...certificate });
                }
            }
            res.status(200).json({ success: true, data: results });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, error: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    }
    async updateShareCode(req, res) {
        try {
            const { carerId } = req.params;
            const { shareCode } = req.body;
            console.log(shareCode, "share code ");
            await this._carerDocumentService.updateShareCode(carerId, shareCode);
            res
                .status(200)
                .json({ success: true, message: "Share code updated successfully" });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, error: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    }
    async updateNiNumber(req, res) {
        try {
            const { carerId } = req.params;
            const { niNumber } = req.body;
            await this._carerDocumentService.updateNiNumber(carerId, niNumber);
            res
                .status(200)
                .json({ success: true, message: "NI Number updated successfully" });
        }
        catch (error) {
            res
                .status(500)
                .json({ success: false, error: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    }
    async getCarerDocuments(req, res) {
        try {
            const { carerId } = req.params;
            console.log(carerId, "carerId");
            const documents = await this._carerDocumentService.getCarerDocuments(carerId);
            res.status(200).json({ success: true, data: documents });
        }
        catch (error) {
            console.log(error, "error andi");
            res
                .status(500)
                .json({ success: false, error: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    }
    async getCarerCertificates(req, res) {
        try {
            const { carerId } = req.params;
            console.log("carerid: ", carerId);
            const certificates = await this._carerDocumentService.getCarerCertificates(carerId);
            res.status(200).json({ success: true, data: certificates });
        }
        catch (error) {
            console.log(error, "error andi");
            res
                .status(500)
                .json({ success: false, error: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    }
    async getCarerAdditionalInfo(req, res) {
        try {
            const { carerId } = req.params;
            const additionalInfo = await this._carerDocumentService.getCarerAdditionalInfo(carerId);
            res.status(200).json({ success: true, data: additionalInfo });
        }
        catch (error) {
            res
                .status(500)
                .json({ success: false, error: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    }
    async deleteCarerDocument(req, res) {
        try {
            const { carerId, documentId, fileName } = req.params;
            await this._carerDocumentService.deleteDocument(carerId, documentId, fileName);
            res
                .status(200)
                .json({ success: true, message: "Document deleted successfully" });
        }
        catch (error) {
            res
                .status(500)
                .json({ success: false, error: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    }
    async deleteCarerCertificate(req, res) {
        try {
            const { carerId, certificateId, fileName } = req.params;
            await this._carerDocumentService.deleteCertificate(carerId, certificateId, fileName);
            res
                .status(200)
                .json({ success: true, message: "Certificate deleted successfully" });
        }
        catch (error) {
            res
                .status(500)
                .json({ success: false, error: strings_1.default.INTERNAL_SERVER_ERROR });
        }
    }
}
exports.default = CarerDocumentController;
//# sourceMappingURL=CarerDocController.js.map