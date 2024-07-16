"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    message;
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = CustomError;
//# sourceMappingURL=ErrorHelper.js.map