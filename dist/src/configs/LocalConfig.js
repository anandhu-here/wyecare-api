"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
class LocalConfig {
    static getConfig() {
        const config = {
            PORT: parseInt(process.env["PORT"], 10) || 4000,
            NODE_ENV: process.env.NODE_ENV,
            SERVER_MAINTENANCE: process.env["SERVER_MAINTENANCE"] === "true",
            MONGO_URI: process.env["MONGO_URI"],
            DB_NAME: process.env["DB_NAME"],
            API_PREFIX: process.env["API_PREFIX"] || "api/v1",
            CORS_ENABLED: process.env["CORS_ENABLED"] === "true",
            LOG_DAYS: process.env["LOG_DAYS"] || 10,
            JWT_SECRET: process.env["JWT_SECRET"],
            JWT_EXPIRES_IN: process.env["JWT_EXPIRES_IN"],
            EMAIL_USER: process.env["EMAIL_USER"],
            EMAIL_PASS: process.env["EMAIL_PASS"],
            BUCKET_NAME: process.env["BUCKET_NAME"],
        };
        for (const [key, value] of Object.entries(config)) {
            if (value === undefined) {
                throw new Error(`Missing key ${key} in Environmental variables`);
            }
        }
        return config;
    }
    static init(_express) {
        _express.locals["app"] = this.getConfig();
        logger_1.default.info("Env Config :: Loaded");
        return _express;
    }
}
exports.default = LocalConfig;
//# sourceMappingURL=LocalConfig.js.map