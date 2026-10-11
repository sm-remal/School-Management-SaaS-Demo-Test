import type { NextFunction, Request, Response } from "express";
export interface AuthenticatedRequest extends Request {
    user?: AuthPayload;
}
interface AuthPayload {
    userId: string;
    email: string;
    roles: string[];
}
export declare const requireAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireSuperAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=auth.d.ts.map