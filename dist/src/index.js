"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./logger"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const main = () => {
    logger_1.default.info("App :: Starting...");
    const app = new app_1.default();
    app._init();
    return app;
};
exports.app = main();
//# sourceMappingURL=index.js.map