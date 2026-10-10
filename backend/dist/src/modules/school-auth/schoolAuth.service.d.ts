import type { SchoolLoginRequest, SchoolLoginResponse } from "./schoolAuth.interface";
declare const login: (payload: SchoolLoginRequest) => Promise<SchoolLoginResponse>;
export declare const schoolAuthService: {
    login: typeof login;
};
export {};
//# sourceMappingURL=schoolAuth.service.d.ts.map