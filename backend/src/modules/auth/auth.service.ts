import type { LoginRequest, LoginResponse } from "./auth.interface";

const login = async (_payload: LoginRequest): Promise<LoginResponse> => {
  throw new Error("Auth login is not implemented yet");
};

export const authService = {
  login,
};
