"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const Database_1 = __importDefault(require("./Database"));
const ExpressApp_1 = __importDefault(require("./ExpressApp"));
class App {
    db;
    constructor() {
        this.db = Database_1.default.getInstance();
    }
    _init = async () => {
        if (this.db) {
            await this.db._connect();
            if (this.db.isConnected) {
                ExpressApp_1.default._init();
            }
            else {
                logger_1.default.error("App :: Database is not connected");
            }
        }
        else {
            logger_1.default.error("App :: Database could't initialized");
        }
    };
    getExpressApp = () => {
        return ExpressApp_1.default.getApp();
    };
}
exports.default = App;
//# sourceMappingURL=index.js.map