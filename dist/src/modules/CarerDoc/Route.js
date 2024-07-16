"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = __importDefault(require("src/middlewares/Auth"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const CarerDocController_1 = __importDefault(require("./CarerDocController"));
const CarerService_1 = __importDefault(require("src/services/CarerService"));
const CarerDocumentRouter = (0, express_1.Router)();
const _carerDocumentService = new CarerService_1.default();
const carerDocumentController = new CarerDocController_1.default();
CarerDocumentRouter.route("/:carerId/upload").post(Auth_1.default.isAuthenticatedUser, (0, express_fileupload_1.default)(), carerDocumentController.uploadFiles.bind(carerDocumentController));
CarerDocumentRouter.route("/:carerId/share-code").patch(Auth_1.default.isAuthenticatedUser, carerDocumentController.updateShareCode.bind(carerDocumentController));
CarerDocumentRouter.route("/:carerId/ni-number").patch(Auth_1.default.isAuthenticatedUser, carerDocumentController.updateNiNumber.bind(carerDocumentController));
CarerDocumentRouter.route("/:carerId/documents").get(Auth_1.default.isAuthenticatedUser, carerDocumentController.getCarerDocuments.bind(carerDocumentController));
CarerDocumentRouter.route("/:carerId/certificates").get(Auth_1.default.isAuthenticatedUser, carerDocumentController.getCarerCertificates.bind(carerDocumentController));
CarerDocumentRouter.route("/:carerId/additional-info").get(Auth_1.default.isAuthenticatedUser, carerDocumentController.getCarerAdditionalInfo.bind(carerDocumentController));
CarerDocumentRouter.route("/:carerId/document/:documentId/file/:fileName").delete(Auth_1.default.isAuthenticatedUser, carerDocumentController.deleteCarerDocument.bind(carerDocumentController));
CarerDocumentRouter.route("/:carerId/certificate/:certificateId/file/:fileName").delete(Auth_1.default.isAuthenticatedUser, carerDocumentController.deleteCarerCertificate.bind(carerDocumentController));
exports.default = CarerDocumentRouter;
//# sourceMappingURL=Route.js.map