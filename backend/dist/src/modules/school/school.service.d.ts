import type { CreateSchoolRequest } from "./school.interface";
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
export declare const schoolService: {
    listSchools: typeof listSchools;
    createSchool: typeof createSchool;
};
export {};
//# sourceMappingURL=school.service.d.ts.map