import type { ErrorRequestHandler } from "express";
import config from "../config";
import { AppError } from "../errors/AppError";

interface PrismaLikeError {
  code?: string;
  meta?: {
    target?: string[];
  };
}

const isPrismaLikeError = (error: unknown): error is PrismaLikeError => {
  return typeof error === "object" && error !== null && "code" in error;
};

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  if (error instanceof AppError) {
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

  const message =
    config.nodeEnv === "production"
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
