import { IRequest as Request, IResponse as Response } from "src/interfaces/core/express";
declare class CarerDocumentController {
    private readonly _carerDocumentService;
    constructor();
    uploadFiles(req: Request, res: Response): Promise<Response>;
    updateShareCode(req: Request, res: Response): Promise<void>;
    updateNiNumber(req: Request, res: Response): Promise<void>;
    getCarerDocuments(req: Request, res: Response): Promise<void>;
    getCarerCertificates(req: Request, res: Response): Promise<void>;
    getCarerAdditionalInfo(req: Request, res: Response): Promise<void>;
    deleteCarerDocument(req: Request, res: Response): Promise<void>;
    deleteCarerCertificate(req: Request, res: Response): Promise<void>;
}
export default CarerDocumentController;
