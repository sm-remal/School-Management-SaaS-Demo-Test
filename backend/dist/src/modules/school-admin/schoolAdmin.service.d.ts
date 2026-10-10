import type { SchoolAdminProfile } from "./schoolAdmin.interface";
declare const getProfile: (payload: {
    userId: string;
    schoolId: string;
    databaseName: string;
}) => Promise<SchoolAdminProfile>;
export declare const schoolAdminService: {
    getProfile: typeof getProfile;
};
export {};
//# sourceMappingURL=schoolAdmin.service.d.ts.map