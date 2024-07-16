"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LocalConfig_1 = __importDefault(require("../configs/LocalConfig"));
const logger_1 = __importDefault(require("../logger"));
const Router_1 = __importDefault(require("../modules/auth/Router"));
const Route_1 = __importDefault(require("src/modules/shiftsType/Route"));
const Route_2 = __importDefault(require("src/modules/shift/Route"));
const Route_3 = __importDefault(require("src/modules/invitations/Route"));
const Route_4 = __importDefault(require("src/modules/email/Route"));
const Route_5 = __importDefault(require("src/modules/Timesheet/Route"));
const Route_6 = __importDefault(require("src/modules/Timeline/Route"));
const Route_7 = __importDefault(require("src/modules/CarerDoc/Route"));
const Route_8 = __importDefault(require("src/modules/Resident/Route"));
class Routes {
    mountApi(_express) {
        const apiPrefix = LocalConfig_1.default.getConfig().API_PREFIX;
        logger_1.default.info("Routes :: Mounting API routes...");
        _express.use(`/${apiPrefix}/auth`, Router_1.default);
        _express.use(`/${apiPrefix}/shifttype`, Route_1.default);
        _express.use(`/${apiPrefix}/shift`, Route_2.default);
        _express.use(`/${apiPrefix}/invitations`, Route_3.default);
        _express.use(`/${apiPrefix}/email`, Route_4.default);
        _express.use(`/${apiPrefix}/timesheet`, Route_5.default);
        _express.use(`/${apiPrefix}/timeline`, Route_6.default);
        _express.use(`/${apiPrefix}/carer-documents`, Route_7.default);
        _express.use(`/${apiPrefix}/residents`, Route_8.default);
        return _express;
    }
}
exports.default = new Routes();
//# sourceMappingURL=Routes.js.map