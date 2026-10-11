import type { Response } from "express";
import type { SchoolAuthenticatedRequest } from "../../middleware/schoolAuth";
declare const getMe: (req: SchoolAuthenticatedRequest, res: Response) => Promise<void>;
export declare const schoolAdminController: {
    getMe: typeof getMe;
};
export {};
//# sourceMappingURL=schoolAdmin.controller.d.ts.map