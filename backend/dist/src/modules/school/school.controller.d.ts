import type { Response } from "express";
import type { AuthenticatedRequest } from "../../shared/auth.middleware";
declare const listSchools: (_req: AuthenticatedRequest, res: Response) => Promise<void>;
declare const createSchool: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const schoolController: {
    listSchools: typeof listSchools;
    createSchool: typeof createSchool;
};
export {};
//# sourceMappingURL=school.controller.d.ts.map