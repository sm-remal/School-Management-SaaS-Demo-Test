export declare class AppError extends Error {
    statusCode: number;
    code: string;
    errors: string[] | undefined;
    details: Record<string, unknown> | undefined;
    constructor(statusCode: number, message: string, code?: string, errors?: string[], details?: Record<string, unknown>);
}
//# sourceMappingURL=AppError.d.ts.map