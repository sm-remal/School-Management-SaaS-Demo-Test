"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const config_1 = __importDefault(require("../config"));
const AppError_1 = require("../errors/AppError");
const isPrismaLikeError = (error) => {
    return typeof error === "object" && error !== null && "code" in error;
};
const globalErrorHandler = (error, _req, res, _next) => {
    if (error instanceof AppError_1.AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            error: {
                code: error.code,
                errors: error.errors,
                details: error.details,
            },
        });
        return;
    }
    if (isPrismaLikeError(error) && error.code === "P2002") {
        res.status(409).json({
            success: false,
            message: "Duplicate record already exists",
            error: {
                code: "DUPLICATE_RECORD",
                field: error.meta?.target?.[0],
            },
        });
        return;
    }
    const message = config_1.default.nodeEnv === "production"
        ? "Internal server error"
        : error instanceof Error
            ? error.message
            : "Internal server error";
    res.status(500).json({
        success: false,
        message,
        error: {
            code: "INTERNAL_ERROR",
        },
    });
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map