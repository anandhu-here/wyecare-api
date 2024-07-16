"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const residentController_1 = __importDefault(require("./residentController"));
const Auth_1 = __importDefault(require("src/middlewares/Auth"));
const router = (0, express_1.Router)();
const residentController = new residentController_1.default();
router.post("/", Auth_1.default.isAuthenticatedUser, residentController.createResident);
router.put("/:residentId", Auth_1.default.isAuthenticatedUser, residentController.updateResident);
router.get("/:residentId", Auth_1.default.isAuthenticatedUser, residentController.getResident);
router.get("/:homeId/all", Auth_1.default.isAuthenticatedUser, residentController.getResidents);
exports.default = router;
//# sourceMappingURL=Route.js.map