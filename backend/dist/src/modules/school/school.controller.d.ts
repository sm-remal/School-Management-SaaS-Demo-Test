import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth";
declare const listSchools: (_req: AuthenticatedRequest, res: Response) => Promise<void>;
declare const createSchool: (req: AuthenticatedRequest, res: Response) => Promise<void>;
declare const activateSchool: (req: AuthenticatedRequest, res: Response) => Promise<void>;
declare const deactivateSchool: (req: AuthenticatedRequest, res: Response) => Promise<void>;
declare const permanentlyDeleteSchool: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const schoolController: {
    listSchools: typeof listSchools;
    createSchool: typeof createSchool;
    activateSchool: typeof activateSchool;
    deactivateSchool: typeof deactivateSchool;
    permanentlyDeleteSchool: typeof permanentlyDeleteSchool;
};
export {};
//# sourceMappingURL=school.controller.d.ts.map