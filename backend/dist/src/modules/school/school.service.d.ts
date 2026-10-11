import type { CreateSchoolRequest } from "./school.interface";
import { AppError } from "../../errors/AppError";
export declare class DuplicateSchoolEmailError extends AppError {
    constructor(email: string);
}
export declare const buildTenantDatabaseUrl: (databaseName: string) => string;
declare const listSchools: () => Promise<({
    tenantDatabase: {
        id: string;
        schoolId: string;
        databaseName: string;
        status: import(".prisma/client").$Enums.TenantDatabaseStatus;
        errorMessage: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null;
} & {
    id: string;
    schoolName: string;
    schoolEmail: string;
    status: import(".prisma/client").$Enums.SchoolStatus;
    errorMessage: string | null;
    createdAt: Date;
    updatedAt: Date;
})[]>;
declare const createSchool: (payload: CreateSchoolRequest, actorUserId: string) => Promise<{
    tenantDatabase: {
        id: string;
        schoolId: string;
        databaseName: string;
        status: import(".prisma/client").$Enums.TenantDatabaseStatus;
        errorMessage: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null;
} & {
    id: string;
    schoolName: string;
    schoolEmail: string;
    status: import(".prisma/client").$Enums.SchoolStatus;
    errorMessage: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
declare const updateSchoolStatus: (schoolId: string, status: "ACTIVE" | "SUSPENDED", actorUserId: string) => Promise<{
    tenantDatabase: {
        id: string;
        schoolId: string;
        databaseName: string;
        status: import(".prisma/client").$Enums.TenantDatabaseStatus;
        errorMessage: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null;
} & {
    id: string;
    schoolName: string;
    schoolEmail: string;
    status: import(".prisma/client").$Enums.SchoolStatus;
    errorMessage: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
declare const permanentlyDeleteSchool: (schoolId: string, confirmationSchoolName: string, actorUserId: string) => Promise<{
    id: string;
    schoolName: string;
    schoolEmail: string;
    databaseName: string | null;
}>;
export declare const schoolService: {
    listSchools: typeof listSchools;
    createSchool: typeof createSchool;
    updateSchoolStatus: typeof updateSchoolStatus;
    permanentlyDeleteSchool: typeof permanentlyDeleteSchool;
};
export {};
//# sourceMappingURL=school.service.d.ts.map