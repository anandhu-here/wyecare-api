"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LocalConfig_1 = __importDefault(require("../configs/LocalConfig"));
const logger_1 = __importDefault(require("../logger"));
const Handler_1 = __importDefault(require("../exceptions/Handler"));
const Http_1 = __importDefault(require("../middlewares/Http"));
const CORS_1 = __importDefault(require("../middlewares/CORS"));
const Morgan_1 = __importDefault(require("../middlewares/Morgan"));
const Routes_1 = __importDefault(require("./Routes"));
const dotenv_1 = require("dotenv");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
(0, dotenv_1.config)();
class ExpressApp {
    express;
    _server;
    constructor() {
        logger_1.default.info("App :: Initializing...");
        this.express = (0, express_1.default)();
        this.mountDotEnv();
        this.mountMiddlewares();
        this.mouteRoutes();
        this.registerHandlers();
        logger_1.default.info("App :: Initialized");
        const serviceAccount = {
            type: process.env.type,
            project_id: process.env.project_id,
            private_key_id: process.env.private_key_id,
            private_key: process.env.private_key.replace(/\\n/g, "\n"),
            client_email: process.env.client_email,
            client_id: process.env.client_id,
            auth_uri: process.env.auth_uri,
            token_uri: process.env.token_uri,
            auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
            client_x509_cert_url: process.env.client_x509_cert_url,
        };
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(serviceAccount),
            storageBucket: LocalConfig_1.default.getConfig().BUCKET_NAME,
        });
        logger_1.default.info("App :: Firebase Admin Initialized");
        console.log("Bucket name: ", LocalConfig_1.default.getConfig().BUCKET_NAME);
    }
    mountDotEnv() {
        logger_1.default.info("Config :: Loading...");
        this.express = LocalConfig_1.default.init(this.express);
    }
    mountMiddlewares() {
        logger_1.default.info("App :: Registering middlewares...");
        this.express = Http_1.default.mount(this.express);
        this.express = Morgan_1.default.mount(this.express);
        if (LocalConfig_1.default.getConfig().CORS_ENABLED) {
            this.express = CORS_1.default.mount(this.express);
        }
        logger_1.default.info("App :: Middlewares registered");
    }
    registerHandlers() {
        logger_1.default.info("App :: Registering handlers...");
        this.express.use((0, express_fileupload_1.default)());
        this.express.use(Handler_1.default.logErrors);
        this.express.use(Handler_1.default.clientErrorHandler);
        this.express.use(Handler_1.default.errorHandler);
        this.express = Handler_1.default.notFoundHandler(this.express);
        logger_1.default.info("App :: Handlers registered");
    }
    mouteRoutes() {
        this.express = Routes_1.default.mountApi(this.express);
        logger_1.default.info("Routes :: API routes mounted");
    }
    _init() {
        logger_1.default.info("Server :: Starting...");
        const port = LocalConfig_1.default.getConfig().PORT || 4040;
        this._server = this.express
            .listen(port, () => {
            return logger_1.default.info(`Server :: Running @ 'http://localhost:${port}'`);
        })
            .on("error", (_error) => {
            return logger_1.default.error("Error: ", _error.message);
        });
    }
    getApp() {
        return this.express;
    }
    _close() {
        logger_1.default.info("Server :: Stopping server...");
        this._server.close(function () {
            process.exit(1);
        });
    }
}
exports.default = new ExpressApp();
//# sourceMappingURL=ExpressApp.js.map