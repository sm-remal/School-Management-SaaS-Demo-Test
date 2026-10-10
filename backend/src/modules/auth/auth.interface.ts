export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}
