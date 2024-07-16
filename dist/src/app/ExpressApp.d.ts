import type { Application } from "express";
declare class ExpressApp {
    express: Application;
    private _server;
    constructor();
    private mountDotEnv;
    private mountMiddlewares;
    private registerHandlers;
    private mouteRoutes;
    _init(): any;
    getApp(): Application;
    _close(): any;
}
declare const _default: ExpressApp;
export default _default;
