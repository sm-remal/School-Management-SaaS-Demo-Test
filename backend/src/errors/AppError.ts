export class AppError extends Error {
  statusCode: number;
  code: string;
  errors: string[] | undefined;
  details: Record<string, unknown> | undefined;

  constructor(
    statusCode: number,
    message: string,
    code = "APP_ERROR",
    errors?: string[],
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.details = details;
  }
}
