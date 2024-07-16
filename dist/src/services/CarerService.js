"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const CarerDoc_1 = __importDefault(require("../models/CarerDoc"));
const CarerCertificate_1 = __importDefault(require("../models/CarerCertificate"));
class CarerDocumentService {
    bucket;
    constructor() {
        this.bucket = process.env.BUCKET;
    }
    async deleteFile(fileName) {
        if (firebase_admin_1.default.apps.length === 0) {
            throw new Error("Firebase Admin SDK not initialized");
        }
        try {
            const bucket = firebase_admin_1.default.storage().bucket(this.bucket);
            const file = bucket.file(fileName);
            await file.delete();
        }
        catch (error) {
            console.error("Error in deleteFile:", error);
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }
    async uploadFile(file, fileName) {
        if (firebase_admin_1.default.apps.length === 0) {
            throw new Error("Firebase Admin SDK not initialized");
        }
        try {
            const bucket = firebase_admin_1.default.storage().bucket(this.bucket);
            const fileBuffer = Buffer.from(file.data);
            const fileUpload = bucket.file(fileName);
            await fileUpload.save(fileBuffer, {
                metadata: {
                    contentType: file.mimetype,
                },
            });
            await fileUpload.makePublic();
            return `https://firebasestorage.googleapis.com/v0/b/${this.bucket}/o/${encodeURIComponent(fileName)}?alt=media`;
        }
        catch (error) {
            console.error("Error in uploadFile:", error);
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }
    async addDocument(carerId, file, type) {
        try {
            const fileName = `documents/${carerId}_${file.name}`;
            const url = await this.uploadFile(file, fileName);
            const document = {
                name: file.name,
                url,
                type,
                uploadDate: new Date(),
            };
            const updatedDoc = await CarerDoc_1.default.findOneAndUpdate({ carerId }, { $push: { documents: document } }, { upsert: true, new: true });
            if (!updatedDoc) {
                throw new Error("Failed to update carer document");
            }
            return document;
        }
        catch (error) {
            console.error("Error in addDocument:", error);
            throw new Error(`Failed to add document: ${error.message}`);
        }
    }
    async deleteDocument(carerId, documentId, fileName) {
        try {
            console.log("deleteDocument", carerId, documentId);
            const carerDoc = await CarerDoc_1.default.findOne({ carerId });
            if (!carerDoc) {
                throw new Error("Carer not found");
            }
            console.log(carerDoc.documents, "carer docs");
            const document = carerDoc.documents.find((doc) => doc._id.toString() === documentId);
            if (!document) {
                throw new Error("Document not found");
            }
            await this.deleteFile(`documents/${carerId}_${fileName}`);
            await CarerDoc_1.default.findOneAndUpdate({ carerId }, { $pull: { documents: { _id: documentId } } });
        }
        catch (error) {
            console.error("Error in deleteDocument:", error);
            throw new Error(`Failed to delete document: ${error.message}`);
        }
    }
    async deleteCertificate(carerId, certificateId, fileName) {
        try {
            const carerCertificate = await CarerCertificate_1.default.findOne({ carerId });
            if (!carerCertificate) {
                throw new Error("Carer not found");
            }
            const certificate = carerCertificate.certificates.find((cert) => cert._id.toString() === certificateId);
            if (!certificate) {
                throw new Error("Certificate not found");
            }
            await this.deleteFile(`certificates/${carerId}_${fileName}`);
            await CarerCertificate_1.default.findOneAndUpdate({ carerId }, { $pull: { certificates: { _id: certificateId } } });
        }
        catch (error) {
            console.error("Error in deleteCertificate:", error);
            throw new Error(`Failed to delete certificate: ${error.message}`);
        }
    }
    async addCertificate(carerId, file, type) {
        try {
            const fileName = `certificates/${carerId}_${file.name}`;
            const url = await this.uploadFile(file, fileName);
            const certificate = {
                name: file.name,
                url,
                type,
                uploadDate: new Date(),
            };
            const updatedCert = await CarerCertificate_1.default.findOneAndUpdate({ carerId }, { $push: { certificates: certificate } }, { upsert: true, new: true });
            if (!updatedCert) {
                throw new Error("Failed to update carer certificate");
            }
            return certificate;
        }
        catch (error) {
            console.error("Error in addCertificate:", error);
            throw new Error(`Failed to add certificate: ${error.message}`);
        }
    }
    async updateShareCode(carerId, shareCode) {
        try {
            const result = await CarerDoc_1.default.findOneAndUpdate({ carerId }, { shareCode }, { new: true });
            if (!result) {
                throw new Error("Carer not found");
            }
        }
        catch (error) {
            console.error("Error in updateShareCode:", error);
            throw new Error(`Failed to update share code: ${error.message}`);
        }
    }
    async updateNiNumber(carerId, niNumber) {
        try {
            const result = await CarerDoc_1.default.findOneAndUpdate({ carerId }, { niNumber }, { new: true });
            if (!result) {
                throw new Error("Carer not found");
            }
        }
        catch (error) {
            console.error("Error in updateNiNumber:", error);
            throw new Error(`Failed to update NI number: ${error.message}`);
        }
    }
    async getCarerDocuments(carerId) {
        try {
            const carerDoc = await CarerDoc_1.default.findOne({ carerId });
            if (!carerDoc) {
                return [];
            }
            return carerDoc.documents || [];
        }
        catch (error) {
            console.error("Error in getCarerDocuments:", error);
            throw new Error(`Failed to get carer documents: ${error.message}`);
        }
    }
    async getCarerCertificates(carerId) {
        try {
            const carerCertificate = await CarerCertificate_1.default.findOne({ carerId });
            if (!carerCertificate) {
                return [];
            }
            return carerCertificate.certificates || [];
        }
        catch (error) {
            console.error("Error in getCarerCertificates:", error);
            throw new Error(`Failed to get carer certificates: ${error.message}`);
        }
    }
    async getCarerAdditionalInfo(carerId) {
        try {
            const carerDoc = await CarerDoc_1.default.findOne({ carerId });
            if (!carerDoc) {
                throw new Error("Carer not found");
            }
            return {
                shareCode: carerDoc.shareCode,
                niNumber: carerDoc.niNumber,
            };
        }
        catch (error) {
            console.error("Error in getCarerAdditionalInfo:", error);
            throw new Error(`Failed to get carer additional info: ${error.message}`);
        }
    }
}
exports.default = CarerDocumentService;
//# sourceMappingURL=CarerService.js.map