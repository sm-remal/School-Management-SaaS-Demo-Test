import type { LoginRequest } from "./auth.interface";

export const validateLoginInput = (payload: Partial<LoginRequest>) => {
  const errors: string[] = [];

  if (!payload.email || typeof payload.email !== "string") {
    errors.push("Email is required");
  }

  if (!payload.password || typeof payload.password !== "string") {
    errors.push("Password is required");
  }

  return {
    success: errors.length === 0,
    errors,
  };
};
