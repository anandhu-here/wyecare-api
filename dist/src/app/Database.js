"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../logger"));
const LocalConfig_1 = __importDefault(require("../configs/LocalConfig"));
class Database {
    static _instance;
    _isConnected;
    _count = 0;
    constructor() {
        logger_1.default.info("Database :: Initializing...");
        if (!LocalConfig_1.default.getConfig().MONGO_URI) {
            logger_1.default.error(`Database :: MongoDB URI not defined`);
            throw new Error(`Database :: MongoDB URI not defined`);
        }
        if (!LocalConfig_1.default.getConfig().DB_NAME) {
            logger_1.default.error(`Database :: Database name not defined`);
            throw new Error(`Database :: Database name not defined`);
        }
        this._isConnected = false;
        logger_1.default.info("Database :: Initialized");
    }
    get isConnected() {
        return this._isConnected;
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new Database();
        }
        return this._instance;
    }
    _connect = async () => {
        if (this._isConnected) {
            logger_1.default.info("Database :: Already Connected");
            return;
        }
        const _db = this;
        _db._count++;
        if (_db._count > 1) {
            logger_1.default.info("Database :: Reconnecting...");
        }
        else {
            logger_1.default.info("Database :: Connecting...");
        }
        await mongoose_1.default
            .connect(LocalConfig_1.default.getConfig().MONGO_URI, {
            dbName: LocalConfig_1.default.getConfig().DB_NAME,
            autoIndex: true,
            socketTimeoutMS: 30000,
            serverSelectionTimeoutMS: 5000,
        })
            .then(function () {
            logger_1.default.info("Database :: Connected @ MongoDB");
            _db._isConnected = true;
        })
            .catch(function (_err) {
            logger_1.default.error(`Database :: Error: ${_err.message}`);
            _db._isConnected = false;
            throw _err;
        });
    };
}
exports.default = Database;
//# sourceMappingURL=Database.js.map