export interface SchoolLoginRequest {
    email: string;
    password: string;
}
export interface SchoolAuthUser {
    id: string;
    email: string;
    role: string;
    schoolId: string;
    schoolName: string;
}
export interface SchoolLoginResponse {
    user: SchoolAuthUser;
    accessToken: string;
}
//# sourceMappingURL=schoolAuth.interface.d.ts.map