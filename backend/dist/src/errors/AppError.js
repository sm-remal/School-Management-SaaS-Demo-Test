"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    code;
    errors;
    details;
    constructor(statusCode, message, code = "APP_ERROR", errors, details) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.code = code;
        this.errors = errors;
        this.details = details;
    }
}
exports.AppError = AppError;
//# sourceMappingURL=AppError.js.map