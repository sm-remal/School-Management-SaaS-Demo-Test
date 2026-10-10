import type { NextFunction, Request, Response } from "express";
export interface SchoolAuthenticatedRequest extends Request {
    schoolUser?: {
        userId: string;
        email: string;
        roles: string[];
        schoolId: string;
        databaseName: string;
    };
}
export declare const requireSchoolAuth: (req: SchoolAuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=schoolAuth.middleware.d.ts.map