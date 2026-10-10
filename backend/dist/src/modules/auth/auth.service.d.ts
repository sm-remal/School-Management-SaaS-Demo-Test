import type { LoginRequest, LoginResponse } from "./auth.interface";
declare const login: (payload: LoginRequest) => Promise<LoginResponse>;
export declare const authService: {
    login: typeof login;
};
export {};
//# sourceMappingURL=auth.service.d.ts.map