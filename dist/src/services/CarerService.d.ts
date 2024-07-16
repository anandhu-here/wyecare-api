import { UploadedFile } from "express-fileupload";
import { ICertificate, IDocument } from "src/interfaces/entities/carer";
declare class CarerDocumentService {
    private bucket;
    constructor();
    deleteFile(fileName: string): Promise<void>;
    uploadFile(file: UploadedFile, fileName: string): Promise<string>;
    addDocument(carerId: string, file: UploadedFile, type: string): Promise<IDocument>;
    deleteDocument(carerId: string, documentId: string, fileName: string): Promise<void>;
    deleteCertificate(carerId: string, certificateId: string, fileName: string): Promise<void>;
    addCertificate(carerId: string, file: UploadedFile, type: string): Promise<ICertificate>;
    updateShareCode(carerId: string, shareCode: string): Promise<void>;
    updateNiNumber(carerId: string, niNumber: string): Promise<void>;
    getCarerDocuments(carerId: string): Promise<IDocument[]>;
    getCarerCertificates(carerId: string): Promise<ICertificate[]>;
    getCarerAdditionalInfo(carerId: string): Promise<{
        shareCode?: string;
        niNumber?: string;
    }>;
}
export default CarerDocumentService;
