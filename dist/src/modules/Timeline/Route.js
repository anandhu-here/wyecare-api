"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = __importDefault(require("src/middlewares/Auth"));
const TimelineController_1 = __importDefault(require("./TimelineController"));
const _timelineCtrl = new TimelineController_1.default();
const TimelineRouter = (0, express_1.Router)();
TimelineRouter.route("/current-agency").get(Auth_1.default.isAuthenticatedUser, _timelineCtrl.getCurrentAgency);
TimelineRouter.route("/previous-agencies").get(Auth_1.default.isAuthenticatedUser, _timelineCtrl.getPreviousAgencies);
TimelineRouter.route("/remove-current-agency").delete(Auth_1.default.isAuthenticatedUser, _timelineCtrl.removeCurrentAgency);
exports.default = TimelineRouter;
//# sourceMappingURL=Route.js.map